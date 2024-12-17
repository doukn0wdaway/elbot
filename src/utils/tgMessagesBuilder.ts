import { TAddress } from "../services/dtekApiService";
import { getCurrentTime } from "./time";

export const msgBuilder = {
  electricityIsNotHere: () => `
🔴 <b>Аллах сказал света не быть</b> 🔴 

Время фактического отключения: ${getCurrentTime()}
`,

  electricityIsHere: () => `
🟢 <b>Альхамдулиллях света сейчас быть</b> 🟢

Время фактического включения: ${getCurrentTime()}
`,

  dtekStatus: (status: TAddress | null) => {
    if (status === null) return `🟢 <b>ДТЕК сказал света должен быть</b> 🟢`;
    return `
🟡 <b>ДТЕК сказал света не быть</b> 🟡 

Тип: ${status.sub_type}
Начало отключения: ${status.start_date} 
Окончание отключения: ${status.end_date} 
`;
  },
};
