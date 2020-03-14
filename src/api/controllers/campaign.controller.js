const Campaign = require('../models/campaign.model');


/**
 * Load campaign and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const campaign = await Campaign.get(id);
    req.locals = { ...req.locals, campaign };
    return next();
  } catch (error) {
    return next(error);
  }
};


/**
 * Get campaign
 * @public
 */
exports.get = (req, res) => res.json(req.locals.campaign.transform());


/**
 * Update existing campaign
 * @public
 */
exports.update = (req, res, next) => {
  const campaign = Object.assign(req.locals.campaign, req.body);

  campaign.save()
    .then(savedCampaign => res.json(savedCampaign.transform()))
    .catch(e => next(e));
};

/**
 * Get campaign list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    const campaigns = await Campaign.find(query);
    // const transformedUsers = users.map(user => user.transform());
    res.json(campaigns.map(campaign => campaign.transform()));
  } catch (error) {
    next(error);
  }
};
