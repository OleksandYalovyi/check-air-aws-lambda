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

  const aqicnRes = res.data;
  const aqicnInd = aqicnRes.data.aqi;
  const forecastAqicnPm25 = aqicnRes.data.forecast.daily.pm25[0].avg;

  console.log("aqicnAqi", aqicnInd);
  console.log("forecastAqicnPm25", forecastAqicnPm25);

  const openWeatherRes = await axios.get(
    "http://api.openweathermap.org/data/2.5/air_pollution?lat=50.0438719&lon=19.9907768&appid=fde1ce566b00af07578dfdb4a3a153b0"
  );
  const openWeatherInd = openWeatherRes.data.list[0].main.aqi;
  console.log("openWeatherInd", openWeatherInd);

  if ((aqicnInd <= 50 || forecastAqicnPm25 <= 50) && openWeatherInd === 1) {
    await sendMsgToBot(
      `It's a good day for a walk!\n` +
        `Air quality index by aqicn ${aqicnRes.data.aqi}\n` +
        `Rest data: pm25 ${aqicnRes.data.iaqi.pm25.v}, pm10 ${aqicnRes.data.iaqi.pm10.v}\n` +
        `Forecast daily pm25: ${forecastAqicnPm25}\n` +
        "Index description: https://aqicn.org/scale/ \n" +
        `Open weather index: ${openWeatherInd}`,
      process.env.CHAT_ID
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
};
