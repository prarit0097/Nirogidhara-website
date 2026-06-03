# Repository Operating Rule

For every future task in this repository:

- After completing and verifying code or content changes, commit and push the work to the GitHub repository.
- After pushing, provide the exact VPS commands needed to pull and deploy the change live.
- Keep deployment isolated under `/var/www/nirogidhara` and run the app on internal port `3017` unless the user explicitly changes that deployment contract.
- Do not commit secrets, `.env`, build output, `node_modules`, runtime databases, or generated server logs.
