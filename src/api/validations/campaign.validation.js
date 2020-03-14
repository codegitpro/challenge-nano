const Joi = require('joi');

module.exports = {

  // GET /campaigns
  listCampaigns: {
    query: {
      status: Joi.string(),
    },
  },

  // POST /campaigns
  createCampaign: {
    body: {
      status: Joi.string().required(),
      goal: Joi.string().required(),
      total_budget: Joi.number().required(),
      name: Joi.string().required(),
    },
  },

  // PUT /campaigns/:campaignId
  updateCampaign: {
    body: {
      status: Joi.string(),
      goal: Joi.string(),
      total_budget: Joi.number(),
      name: Joi.string(),
    },
    params: {
      campaignId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // DELETE /campaigns/:campaignId
  removeCampaign: {
    params: {
      campaignId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

};
