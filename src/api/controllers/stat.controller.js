const Stat = require('../models/stat.model');
const Ad = require('../models/ad.model');

/**
 * Load campaign and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const stat = await Stat.get(id);
    req.locals = { ...req.locals, stat };
    return next();
  } catch (error) {
    return next(error);
  }
};


/**
 * Get campaign
 * @public
 */
exports.get = (req, res) => res.json(req.locals.stat.transform());


/**
 * Update existing campaign
 * @public
 */
exports.update = (req, res, next) => {
  const stat = Object.assign(req.locals.stat, req.body);

  stat.save()
    .then(savedStat => res.json(savedStat.transform()))
    .catch(e => next(e));
};

/**
 * Get campaign list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const { ad } = req.locals;
    let query = {};
    const { start, end } = req.query;
    if (start || end) {
      const dateQuery = {};
      if (start) {
        dateQuery.$gte = new Date(start).setHours(0, 0, 0);
      }
      if (end) {
        dateQuery.$lte = new Date(end).setHours(23, 59, 59);
      }
      query = { date: dateQuery };
    }

    const populatedAd = await Ad.findById(ad._id).populate({
      path: 'stats',
      match: query,
    });
    res.json(populatedAd.stats.map(stat => stat.transform()));
  } catch (error) {
    next(error);
  }
};
