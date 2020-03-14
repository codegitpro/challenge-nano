const mongoose = require('mongoose');

const { Schema } = mongoose;
const APIError = require('../utils/APIError');
const httpStatus = require('http-status');

const statSchema = new Schema({
  clicks: Number,
  cost: Number,
  impressions: Number,
  date: Date,
});


/**
 * Methods
 */
statSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'clicks', 'cost', 'impressions', 'date'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    transformed.cost_per_click = parseFloat((this.cost / this.clicks).toFixed(2));

    return transformed;
  },
});


/**
 * Statics
 */
statSchema.statics = {

  /**
   * Get stat
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<Stat, APIError>}
   */
  async get(id) {
    try {
      let stat;

      if (mongoose.Types.ObjectId.isValid(id)) {
        stat = await this.findById(id).exec();
      }
      if (stat) {
        return stat;
      }

      throw new APIError({
        message: 'Stat does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

};

module.exports = mongoose.model('Stat', statSchema);
