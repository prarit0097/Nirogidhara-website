import { seedInitialContent } from "../lib/generator";

console.log(JSON.stringify(await seedInitialContent(), null, 2));
