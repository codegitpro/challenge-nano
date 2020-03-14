const mongoose = require('mongoose');
const APIError = require('../utils/APIError');
const httpStatus = require('http-status');

const { Schema } = mongoose;

const campaignSchema = new Schema({
  name: String,
  status: String,
  goal: String,
  total_budget: Number,
  adgroups: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Adgroup',
    },
  ],
});


/**
 * Methods
 */
campaignSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'status', 'goal', 'total_budget'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


/**
 * Statics
 */
campaignSchema.statics = {

  /**
   * Get campaign
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<Campaign, APIError>}
   */
  async get(id) {
    try {
      let campaign;

      if (mongoose.Types.ObjectId.isValid(id)) {
        campaign = await this.findById(id).populate('adgroups');
      }
      if (campaign) {
        return campaign;
      }

      throw new APIError({
        message: 'Campaign does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

};


module.exports = mongoose.model('Campaign', campaignSchema);
