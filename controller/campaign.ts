import express, { Request, Response } from "express";
import { jaction } from "../utils/express-utils";
import got from "got";
import _ from "lodash";

interface ICampaign {
  title: string;
  totalAmount: number;
  backersCount: number;
  endDate: string;
  created?: string;
}

export function getCampaignRouter() {
  return express
    .Router({ mergeParams: true })
    .get("/list", jaction(getCampaignList))
    .get("/active-campaigns", jaction(getActiveCampaigns))
    .get("/closed-campaigns", jaction(getClosedCampaigns));
}

async function getCampaignList(req: Request) {
  const data = await got.get("https://testapi.donatekart.com/api/campaign", {
    responseType: "json",
  });
  const body = data.body as any[];
  const campaignData = body.map((campaign: ICampaign) => {
    const { title, totalAmount, backersCount, endDate } = campaign;
    return {
      title,
      totalAmount,
      backersCount,
      endDate,
    };
  });
  return _.orderBy(campaignData, ["totalAmount"], ["desc"]);
}

async function getActiveCampaigns(req: Request) {
  const data = await got.get("https://testapi.donatekart.com/api/campaign", {
    responseType: "json",
  });
  const body = data.body as any[];

  const activeCampaigns = body
    .filter((campaign) => {
      const { endDate } = campaign;
      if (endDate) {
        const todayDate = new Date();
        const expiryDate = new Date(endDate);
        return todayDate.getTime() <= expiryDate.getTime();
      } else {
        return false;
      }
    })
    .filter((campaign) => {
      const { created } = campaign;
      const activeThresholdDate =
        new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
      const createdDate = new Date(created).getTime();
      return createdDate >= activeThresholdDate;
    });

  return activeCampaigns;
}

async function getClosedCampaigns(req: Request) {
  const data = await got.get("https://testapi.donatekart.com/api/campaign", {
    responseType: "json",
  });
  const body = data.body as any[];

  const closedCampaigns = body.filter((campaign) => {
    const { endDate, procuredAmount, totalAmount } = campaign;
    if (endDate) {
      const todayDate = new Date();
      const expiryDate = new Date(endDate);
      return (
        todayDate.getTime() > expiryDate.getTime() ||
        procuredAmount >= totalAmount
      );
    } else {
      return false;
    }
  });
  return closedCampaigns;
}
