const Adgroup = require('../models/adgroup.model');


/**
 * Load campaign and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const adgroup = await Adgroup.get(id);
    req.locals = { ...req.locals, adgroup };
    return next();
  } catch (error) {
    return next(error);
  }
};


/**
 * Get campaign
 * @public
 */
exports.get = (req, res) => res.json(req.locals.adgroup.transform());


/**
 * Update existing campaign
 * @public
 */
exports.update = (req, res, next) => {
  const adgroup = Object.assign(req.locals.adgroup, req.body);

  adgroup.save()
    .then(savedAdgroup => res.json(savedAdgroup.transform()))
    .catch(e => next(e));
};

/**
 * Get campaign list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const { campaign } = req.locals;
    res.json(campaign.adgroups.map(adgroup => adgroup.transform()));
  } catch (error) {
    next(error);
  }
};
