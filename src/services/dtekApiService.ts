import https from "https";
import { load } from "cheerio";
import { BASE_URL, DTEK_URL } from "../config";

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

export const getScheduleImage = async (): Promise<string | null> => {
  const html = await getImageFile();
  const dtekPage = load(html as any);
  if (!dtekPage) return null;

  const imageSrc = dtekPage(
    "section.section div.container figure picture img",
  ).attr("src");

  if (!imageSrc) return null;

  const imageUrl = BASE_URL + imageSrc;

  return imageUrl;
};

export const getStatusByDTEK = async (): Promise<TAddress | null> => {
  const data = await fetch("https://www.dtek-oem.com.ua/ua/ajax", {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      pragma: "no-cache",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-csrf-token":
        "sQpy7Fpg3TgYpMmi86TEiCcRRgiExRk8ReVWz2dBxcaITwOHETecVCzl_O2X8vOxXWc1ad29TXMEqGH5LwS_tA==",
      "x-requested-with": "XMLHttpRequest",
      cookie:
        "Domain=dtek-oem.com.ua; _language=4feef5ffdc846bbf9c35c97292b7b3e6c48117a536a6462b530e0984a39d6bd4a%3A2%3A%7Bi%3A0%3Bs%3A9%3A%22_language%22%3Bi%3A1%3Bs%3A2%3A%22uk%22%3B%7D; visid_incap_2398477=Z8duih5wTI6CxqZYuhtLUMc7O2cAAAAAQUIPAAAAAABWV4Ue3XQ5yaZ/eaeVMAQO; _hjSessionUser_2709929=eyJpZCI6ImI0MTlkMjg0LTcyOGUtNTc0Yi1iNGE3LWFhNzE3Mzc1YTdiNSIsImNyZWF0ZWQiOjE3MzE5MzUxNzYxMTIsImV4aXN0aW5nIjp0cnVlfQ==; _gid=GA1.3.1571007357.1734435036; dtek-oem=gg010i2ed1b3crj4d7unstol6l; _csrf-dtek-oem=5194bf20290f26f3cf3407cdaeb3a7af6fba698af497e8bb81fefc5f07034aaba%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-dtek-oem%22%3Bi%3A1%3Bs%3A32%3A%229EqkKWAl4A5OdV79zvsaYxTOAM76HEzr%22%3B%7D; incap_ses_324_2398477=m5ppHzkKFXzxjdCGXRR/BNGRYWcAAAAAhAcMWWPjXyZ3dHpXLBj0cw==; _ga_B5BT53GY2T=GS1.1.1734447571.8.0.1734447571.60.0.0; _ga=GA1.3.1969168491.1731935176",
      Referer: "https://www.dtek-oem.com.ua/ua/shutdowns",
      "Referrer-Policy": "origin-when-cross-origin",
    },
    body: "method=getHomeNum&data%5B0%5D%5Bname%5D=city&data%5B0%5D%5Bvalue%5D=%D0%BC.+%D0%9E%D0%B4%D0%B5%D1%81%D0%B0&data%5B1%5D%5Bname%5D=street&data%5B1%5D%5Bvalue%5D=%D0%B2%D1%83%D0%BB.+%D0%9F%D0%B5%D1%82%D1%80%D0%B0+%D0%9D%D1%96%D1%89%D0%B8%D0%BD%D1%81%D1%8C%D0%BA%D0%BE%D0%B3%D0%BE",
    method: "POST",
  });

  if (data.status === 200)
    return ((await data.json()) as TDTEKResponse).data["4"];
  return null;
};

export type TAddress = {
  sub_type: string;
  start_date: string;
  end_date: string;
  type: string;
  sub_type_reason: string[];
  voluntarily: any;
};

export type TDTEKResponse = {
  result: boolean;
  data: Record<string, TAddress>;
  showCurOutageParam: boolean;
  showCurSchedule: boolean;
  showTableSchedule: boolean;
  updateTimestamp: string;
};
