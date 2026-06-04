const http = require("node:http");

const endpoint = process.env.NIROGIDHARA_CRON_URL || "http://127.0.0.1:3000/api/automation/daily";
const secret = process.env.CRON_SECRET || "";
const runHourIst = Number.parseInt(process.env.NIROGIDHARA_CRON_HOUR_IST || "7", 10);
const scheduleLabel = `${String(runHourIst).padStart(2, "0")}:00 Asia/Kolkata`;

function msUntilNextRun() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });
  const parts = Object.fromEntries(formatter.formatToParts(now).map((part) => [part.type, part.value]));
  const istNow = new Date(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+05:30`);
  let next = new Date(`${parts.year}-${parts.month}-${parts.day}T${String(runHourIst).padStart(2, "0")}:00:00+05:30`);
  if (istNow >= next) {
    next = new Date(next.getTime() + 86_400_000);
  }
  return Math.max(1_000, next.getTime() - istNow.getTime());
}

function run() {
  const url = new URL(endpoint);
  const request = http.request(
    {
      method: "POST",
      hostname: url.hostname,
      port: url.port || 80,
      path: `${url.pathname}${url.search}`,
      headers: secret ? { "x-cron-secret": secret } : {}
    },
    (response) => {
      let body = "";
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        console.log(`[${new Date().toISOString()}] daily cron ${response.statusCode}: ${body}`);
        schedule();
      });
    }
  );
  request.on("error", (error) => {
    console.error(`[${new Date().toISOString()}] daily cron failed`, error);
    schedule();
  });
  request.end();
}

function schedule() {
  const delay = msUntilNextRun();
  console.log(`Next Nirogidhara daily generation at ${scheduleLabel}, in ${Math.round(delay / 60000)} minutes.`);
  setTimeout(run, delay);
}

schedule();
