const httpStatus = require('http-status');
const mongoose = require('mongoose');
const APIError = require('../utils/APIError');

const { Schema } = mongoose;

const adgroupSchema = new Schema({
  name: String,
  age_range: [Number],
  locations: [String],
  keywords: [String],
  genders: [String],
  ads: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Ad',
    },
  ],
});


/**
 * Methods
 */
adgroupSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'age_range', 'locations', 'keywords', 'genders'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


/**
 * Statics
 */
adgroupSchema.statics = {

  /**
   * Get adgroup
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<Adgroup, APIError>}
   */
  async get(id) {
    try {
      let adgroup;

      if (mongoose.Types.ObjectId.isValid(id)) {
        adgroup = await this.findById(id).populate('ads');
      }
      if (adgroup) {
        return adgroup;
      }

      throw new APIError({
        message: 'Adgroup does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

};

module.exports = mongoose.model('Adgroup', adgroupSchema);
