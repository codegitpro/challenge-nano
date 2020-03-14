const Joi = require('joi');

module.exports = {

  // GET /stats
  listStats: {
    query: {
      status: Joi.string(),
    },
  },

  // POST /stats
  createStat: {
    body: {
      clicks: Joi.number().required(),
      cost: Joi.number().required(),
      date: Joi.string().required(),
      impressions: Joi.number().required(),
    },
  },

  // PUT /stats/:statId
  updateStat: {
    body: {
      clicks: Joi.number(),
      cost: Joi.number(),
      date: Joi.string(),
      impressions: Joi.number(),
    },
    params: {
      statId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // DELETE /stats/:statId
  deleteStat: {
    params: {
      statId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

};
