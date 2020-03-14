const Joi = require('joi');

module.exports = {

  // POST /adgroups
  createAdgroup: {
    body: {
      age_range: Joi.array().items(Joi.number()).length(2).required(),
      name: Joi.string().required(),
      locations: Joi.array().items(Joi.string()).required(),
      keywords: Joi.array().items(Joi.string()).required(),
      genders: Joi.array().items(Joi.string()).required(),
    },
  },

  // PUT /adgroups/:adgroupId
  updateAdgroup: {
    body: {
      age_range: Joi.array().items(Joi.number()).length(2),
      name: Joi.string(),
      locations: Joi.array().items(Joi.string()),
      keywords: Joi.array().items(Joi.string()),
      genders: Joi.array().items(Joi.string()),
    },
    params: {
      adgroupId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // DELETE /adgroups/:adgroupId
  deleteAdgroup: {
    params: {
      adgroupId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

};
