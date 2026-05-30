import mqtt from 'mqtt';
import mongoose from 'mongoose';

// --- 1. 定義 MongoDB 資料結構 (Schema) ---
// 這確保寫入資料庫的格式是統一且安全的
const vitalSchema = new mongoose.Schema({
  deviceId: String,
  heartRate: Number,
  isCovered: Boolean,
  timestamp: Date,
  alertReason: String // 紀錄為何觸發警報
});

// 建立可操作資料庫的模型 (Model)
const VitalAlert = mongoose.model('VitalAlert', vitalSchema);
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/baby-monitor';
const mqttUri = process.env.MQTT_URI || 'mqtt://localhost:1883';

const startHub = async () => {
  try {
    // --- 2. 連線到我們剛剛用 Docker 跑起來的 MongoDB ---
    await mongoose.connect(mongoUri + '?family=4');
    console.log(`✅ MongoDB connected successfully to ${mongoUri}`);

    // --- 3. 連線到 MQTT Broker ---
    const client = mqtt.connect(mqttUri);

    client.on('connect', () => {
      console.log(`✅ Backend hub connected to MQTT Broker at ${mqttUri}`);

      // 訂閱與模擬器相同的「主題」
      client.subscribe('device/baby/vitals', (err) => {
        if (!err) console.log('🎧 Listening for baby monitor data...\n');
      });
    });

    // --- 4. 接收到新訊息時的處理邏輯 ---
    client.on('message', async (topic, message) => {
      const data = JSON.parse(message.toString());

      let isAlert = false;
      let reason = '';

      // 商業邏輯：判斷是否危險
      if (data.isCovered) {
        isAlert = true;
        reason = 'Nose/Mouth Covered';
      } else if (data.heartRate > 155 || data.heartRate < 115) {
        isAlert = true;
        reason = 'Abnormal Heart Rate';
      }

      // 如果有危險，寫入資料庫
      if (isAlert) {
        console.log(`⚠️ [ALERT] Reason: ${reason}! (Heart Rate: ${data.heartRate}) - Preparing to save to DB...`);

        const newAlert = new VitalAlert({
          deviceId: data.deviceId,
          heartRate: data.heartRate,
          isCovered: data.isCovered,
          timestamp: new Date(data.timestamp),
          alertReason: reason
        });

        // 儲存至 MongoDB
        await newAlert.save();
        console.log(`💾 [Database] Alert record saved successfully!\n`);
      } else {
        console.log(`💚 [NORMAL] Heart Rate: ${data.heartRate}, Covered: false`);
      }
    });

  } catch (err) {
    console.error('❌ System startup failed:', err);
  }
};

// 啟動服務
startHub();