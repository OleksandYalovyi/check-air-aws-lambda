import axios from "axios";

const sendMsgToBot = async (msg, chatId) => {
  const sendText = `https://api.telegram.org/bot${
    process.env.TELEGRAM_TOKEN
  }/sendMessage?chat_id=${chatId}&parse_mode=HTML&text=${encodeURIComponent(
    msg
  )}`;
  return await axios.get(sendText);
};

export const handler = async () => {
  const res = await axios.get(
    "https://api.waqi.info/feed/geo:50.0438719;19.9907768/?token=4c2de55087433a8c208a462a3da340e45dae14b7"
  );

  const aqiRes = res.data;

  console.log("status", aqiRes.status);
  console.log("aqi", aqiRes.data.aqi);
  console.log("idx", aqiRes.data.idx);

  if (aqiRes.data.aqi <= 50 || aqiRes.data.forecast.daily.pm25[0].avg <= 50) {
    await sendMsgToBot(
      `It's a good day for a walk!\n` +
        `Air quality index by aqicn ${aqiRes.data.aqi}\n` +
        `Rest data: pm25 ${aqiRes.data.iaqi.pm25.v}, pm10 ${aqiRes.data.iaqi.pm10.v}\n` +
        `Forecast daily pm25: ${aqiRes.data.forecast.daily.pm25[0].avg}\n` +
        "Index description: https://aqicn.org/scale/",
      process.env.CHAT_ID
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
};
