import { generateDailyContent } from "../lib/generator";

console.log(JSON.stringify(await generateDailyContent(), null, 2));
