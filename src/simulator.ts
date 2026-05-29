// 這個檔案是模擬器 (Simulator)，負責定期產生模擬的嬰兒生命徵象數據，並透過 MQTT 協議發布到指定的主題 (Topic) 上。
import mqtt from 'mqtt';

// 1. 連線到你剛剛用 Docker 跑起來的 MQTT Broker
const client = mqtt.connect('mqtt://localhost:1883');

// 2. 定義感測器數據的型別 (這是使用 TypeScript 的最大優勢，確保資料格式正確)
interface BabyVitals {
  deviceId: string;
  heartRate: number;
  isCovered: boolean; // 模擬 AI 視覺辨識：寶寶口鼻是否被覆蓋
  timestamp: number;
}

client.on('connect', () => {
  console.log('✅ Baby Monitor connected to MQTT Broker successfully!');

  // 3. 設定定時器，每 3 秒 (3000 毫秒) 執行一次
  setInterval(() => {
    // 隨機生成模擬數據
    const vitals: BabyVitals = {
      deviceId: 'baby-cam-001',
      heartRate: Math.floor(Math.random() * (160 - 110 + 1)) + 110, // 嬰兒正常心跳約 110-160
      isCovered: Math.random() > 0.8, // 模擬 20% 的機率發生危險 (口鼻被覆蓋)
      timestamp: Date.now()
    };

    // 4. 將資料轉成字串，並「發布 (Publish)」到特定的「主題 (Topic)」
    const topic = 'device/baby/vitals';
    client.publish(topic, JSON.stringify(vitals));

    console.log(`📤 [Release data] to topic ${topic}:`, vitals);
  }, 3000);
});

client.on('error', (err) => {
  console.error('❌ MQTT connection error:', err);
});