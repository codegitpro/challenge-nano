const httpStatus = require('http-status');
const mongoose = require('mongoose');
const APIError = require('../utils/APIError');

const { Schema } = mongoose;

const adSchema = new Schema({
  url: String,
  image: String,
  header: String,
  description: String,
  stats: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Stat',
    },
  ],
});

/**
 * Methods
 */
adSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'url', 'image', 'header', 'description'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
adSchema.statics = {

  /**
   * Get ad
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<Ad, APIError>}
   */
  async get(id) {
    try {
      let ad;

      if (mongoose.Types.ObjectId.isValid(id)) {
        ad = await this.findById(id).populate('stats');
      }
      if (ad) {
        return ad;
      }

      throw new APIError({
        message: 'Ad does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

};

module.exports = mongoose.model('Ad', adSchema);
