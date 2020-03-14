const Adgroup = require('../models/adgroup.model');
const Ad = require('../models/ad.model');


/**
 * Load campaign and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const ad = await Ad.get(id);
    req.locals = { ...req.locals, ad };
    return next();
  } catch (error) {
    return next(error);
  }
};


/**
 * Get campaign
 * @public
 */
exports.get = (req, res) => res.json(req.locals.ad.transform());

/**
 * Update existing campaign
 * @public
 */
exports.update = (req, res, next) => {
  const ad = Object.assign(req.locals.ad, req.body);

  ad.save()
    .then(savedAd => res.json(savedAd.transform()))
    .catch(e => next(e));
};

/**
 * Get campaign list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const { campaign } = req.locals;
    let ads = [];

    for (let i = 0; i < campaign.adgroups.length; i += 1) {
      const adgroup = campaign.adgroups[i];
      const populatedAdgroup = await Adgroup.findById(adgroup._id).populate('ads');
      ads = [...ads, ...populatedAdgroup.ads];
    }
    console.log(ads);
    res.json(ads.map(ad => ad.transform()));
  } catch (error) {
    next(error);
  }
};
