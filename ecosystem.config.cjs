module.exports = {
  apps: [
    {
      name: "nirogidhara",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3017",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: "3017"
      }
    },
    {
      name: "nirogidhara-daily-cron",
      script: "scripts/cron-runner.cjs",
      cwd: __dirname,
      autorestart: true,
      env: {
        NODE_ENV: "production",
        NIROGIDHARA_CRON_URL: "http://127.0.0.1:3017/api/automation/daily"
      }
    }
  ]
};
