import express from "express";
import * as xp from "./utils/express-utils";
import config from "./config";
import { getCampaignRouter } from "./controller/campaign";

async function main() {
  express()
    .use(express.json())
    .use("/campaign", getCampaignRouter())
    .use(xp.notFound)
    .listen(config.port, () => {
      console.log(`server listening on http://localhost:${config.port}`);
    });
}

main().catch((err) => console.error("app.init.failed", err));

// http://localhost:4000/campaign/closed-campaigns
// http://localhost:4000/campaign/active-campaigns
// http://localhost:4000/campaign/list
