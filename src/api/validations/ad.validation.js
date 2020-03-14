const Joi = require('joi');

module.exports = {


  // POST /ads
  createAd: {
    body: {
      description: Joi.string().required(),
      url: Joi.string().required(),
      image: Joi.string().required(),
      header: Joi.string().required(),
    },
  },

  // PUT /ads/:adId
  updateAd: {
    body: {
      description: Joi.string(),
      url: Joi.string(),
      image: Joi.string(),
      header: Joi.string(),
    },
    params: {
      adId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // DELETE /ads/:adId
  deleteAd: {
    params: {
      adId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

};
