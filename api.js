import { load } from "cheerio";
import https from "https";
import { BASE_URL, DTEK_URL } from "./config.js";

const getImageFile = () => {
  return new Promise((resolve, reject) => {
    https
      .get(DTEK_URL, (res) => {
        if (res.statusCode !== 200) {
          reject(
            new Error(`Failed to get file. Status code: ${res.statusCode}`),
          );
          return;
        }

        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(data);
        });
      })
      .on("error", reject);
  });
};

export const getImageUrl = async () => {
  const html = await getImageFile();
  const $ = load(html);
  const imageUrl =
    BASE_URL +
    $("section.section div.container figure picture img").attr("src");

  return imageUrl;
};

async function fetchWithRetry(url, options, retries = 3, callback = null) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (callback) {
        callback(null, data); // Call the callback with no error and the data
      }

      return data;
    } catch (err) {
      if (i < retries - 1) {
        console.log(`Retrying... (${i + 1})`);
        await new Promise((res) => setTimeout(res, 2000));
      } else {
        if (callback) {
          callback(err, null); // Call the callback with the error and no data
        }
        throw err;
      }
    }
  }
}

export const getDTEKMessage = async (callback = null) => {
  const url = "https://www.dtek-oem.com.ua/ua/ajax";
  const options = {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-csrf-token":
        "6JgsROFISU6inuK0q0jBYT7aWuhvou3L5cvo5HQomn7Y7WUi2CMnKPOq1PzqG4QOe7YMvASbpJ2qpYmgDmPvLw==",
      "x-requested-with": "XMLHttpRequest",
      cookie:
        "Domain=dtek-oem.com.ua; _language=4feef5ffdc846bbf9c35c97292b7b3e6c48117a536a6462b530e0984a39d6bd4a%3A2%3A%7Bi%3A0%3Bs%3A9%3A%22_language%22%3Bi%3A1%3Bs%3A2%3A%22uk%22%3B%7D; visid_incap_2398477=Z8duih5wTI6CxqZYuhtLUMc7O2cAAAAAQUIPAAAAAABWV4Ue3XQ5yaZ/eaeVMAQO; _hjSessionUser_2709929=eyJpZCI6ImI0MTlkMjg0LTcyOGUtNTc0Yi1iNGE3LWFhNzE3Mzc1YTdiNSIsImNyZWF0ZWQiOjE3MzE5MzUxNzYxMTIsImV4aXN0aW5nIjp0cnVlfQ==; dtek-oem=8osjm06rid098d2nbcvhmmu67b; _csrf-dtek-oem=0fec47bd1031a4f0499b7366ca7ba522afa955b6d330ef546b2278a549d26fd3a%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-dtek-oem%22%3Bi%3A1%3Bs%3A32%3A%220uIf9knfQ46HASEoElVTk9IVOnaDzKuQ%22%3B%7D; Domain=dtek-oem.com.ua; incap_ses_325_2398477=YNcHUAVYc2q6IcjA/KGCBFWZXWcAAAAAQdTxMxXxx2XY/KFE8R7bWw==; _gid=GA1.3.1870568968.1734187353; _hjSession_2709929=eyJpZCI6ImFiOGQyZDliLWJlZmUtNDI4Ni05ZTliLWExMzM4NmI1YmYyZiIsImMiOjE3MzQxODczNTMzNTEsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; _ga_B5BT53GY2T=GS1.1.1734187351.5.1.1734187518.60.0.0; _ga=GA1.3.1969168491.1731935176; _gat_gtag_UA_141782039_1=1; incap_wrt_377=/pldZwAAAABE1yxOGQAI+QIQuIm0lkEYqrb2ugYgAijVsva6BjABFeQVDLY33rpwhVT8U9V63Q==",
      Referer: "https://www.dtek-oem.com.ua/ua/shutdowns",
      "Referrer-Policy": "origin-when-cross-origin",
    },
    body: "method=getHomeNum&data%5B0%5D%5Bname%5D=city&data%5B0%5D%5Bvalue%5D=%D0%BC.+%D0%9E%D0%B4%D0%B5%D1%81%D0%B0&data%5B1%5D%5Bname%5D=street&data%5B1%5D%5Bvalue%5D=%D0%B2%D1%83%D0%BB.+%D0%9C%D0%B0%D0%BD%D0%B5%D0%B6%D0%BD%D0%B0",
    method: "POST",
  };

  try {
    const response = await fetchWithRetry(url, options, 3, callback);
    const data = response.data?.["40"];

    if (!data || !data.sub_type || !data.start_date || !data.end_date)
      return `<b>🟢 ДТЕК сказал света должен быть 🟢</b>`;

    return `<b>🟡 ДТЕК сказал света не быть 🟡</b>

<b>Тип:</b> ${data.sub_type}
<b>Начало отключения:</b> ${data.start_date}
<b>Окончание отключения:</b> ${data.end_date}`;
  } catch (err) {
    console.error("Failed to fetch DTEK message:", err);
    return `<b>🟢 ДТЕК сказал света должен быть 🟢</b>`;
  }
};
