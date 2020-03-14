/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const { some } = require('lodash');
const app = require('../../index');
const Campaign = require('../models/campaign.model');
const Adgroup = require('../models/adgroup.model');
const Ad = require('../models/ad.model');

describe('Ad API', async () => {
  beforeEach(async () => {
    testCampaignData = {
      status: 'Pending',
      goal: 'Branding',
      total_budget: 100,
      name: 'Test Campaign',
    };

    testAdgroupData = [
      {
        age_range: [20, 39],
        name: 'Test Adgroup 1',
        locations: ['Zurich'],
        keywords: ['Best football boots', 'Best shoes'],
        genders: ['Male', 'Female'],
      },
      {
        age_range: [20, 40],
        name: 'Test Adgroup 2',
        locations: ['London', 'Paris'],
        keywords: ['Nike Mercurial', 'Best boots'],
        genders: ['Female'],
      },
    ];

    testAdsData = [
      [
        {
          description: 'Test Ad 1',
          url: 'nanos.ai',
          image: 'test_ad_image_1.jpg',
          header: 'Test Header 1',
        },
        {
          description: 'Test Ad 2',
          url: 'nanos1.ai',
          image: 'test_ad_image_2.jpg',
          header: 'Test Header 2',
        },
        {
          description: 'Test Ad 3',
          url: 'nanos2.ai',
          image: 'test_ad_image_3.jpg',
          header: 'Test Header 3',
        },
      ],

      [
        {
          description: 'Test Ad 4',
          url: 'nanos4.ai',
          image: 'test_ad_image_4.jpg',
          header: 'Test Header 4',
        },
        {
          description: 'Test Ad 5',
          url: 'nanos5.ai',
          image: 'test_ad_image_5.jpg',
          header: 'Test Header 5',
        },
      ],
    ];

    testAds = [];
    testAdgroups = [];

    for (let i = 0; i < 2; i += 1) {
      const testAdsForGroup = [];
      for (let j = 0; j < testAdsData[i].length; j += 1) {
        testAd = new Ad(testAdsData[i][j]);
        testAd = await testAd.save();
        testAdsForGroup.push(testAd);
      }

      testAdgroup = new Adgroup(testAdgroupData[i]);
      testAdgroup.ads = testAdsForGroup;
      testAdgroup = await testAdgroup.save();
      testAdgroups.push(testAdgroup);
      testAds.push(testAdsForGroup);
    }

    testCampaign = new Campaign(testCampaignData);
    testCampaign.adgroups = testAdgroups;
    testCampaign = await testCampaign.save();

    testAdgroup = testAdgroups[0];
    testAd = testAds[0][0];
  });

  afterEach(async () => {
    for (let i = 0; i < 2; i += 1) {
      for (let j = 0; j < testAdsData[i].length; j += 1) {
        await testAds[i][j].remove();
      }
      await testAdgroups[i].remove();
    }
    await testCampaign.remove();
  });


  describe('GET /campaign/:id/ads', () => {
    it('should get all ads', () => {
      return request(app)
        .get(`/campaigns/${testCampaign.id}/ads`)
        .expect(httpStatus.OK)
        .then(async (res) => {
          let includesTestAds = true;
          [...testAdsData[0], ...testAdsData[1]]
            .forEach(d => includesTestAds = includesTestAds && some(res.body, d));

          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(5);
          expect(includesTestAds).to.be.true;
        });
    });


    it('should report error "Campaign does not exist" when ad does not exists', () => {
      return request(app)
        .get('/campaigns/020202020202020202020202/ads')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Campaign does not exist');
        });
    });

    it('should report error "Campaign does not exist" when id is not a valid ObjectID', () => {
      return request(app)
        .get('/campaigns/test/ads')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.equal('Campaign does not exist');
        });
    });
  });

  describe('GET /ads/:id', () => {
    it('should get ad', async () => {
      return request(app)
        .get(`/ads/${testAd._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.deep.include(testAdsData[0][0]);
        });
    });

    it('should report error "Ad does not exist" when ad does not exists', () => {
      return request(app)
        .get('/ads/020202020202020202020202')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Ad does not exist');
        });
    });

    it('should report error "Ad does not exist" when id is not a valid ObjectID', () => {
      return request(app)
        .get('/ads/test')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.equal('Ad does not exist');
        });
    });
  });

  describe('PUT /ads/:id', () => {
    it('should update ad', async () => {
      const updateData = {
        description: 'Update desc',
        url: 'update.nanos.ai',
        image: 'update image',
        header: 'Update header',
      };

      return request(app)
        .put(`/ads/${testAd._id}`)
        .send(updateData)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.deep.include(updateData);
        });
    });

    it('should report error "Validation Error" ', async () => {
      const data = {
        description: 234,
      };

      return request(app)
        .put(`/ads/${testAd._id}`)
        .send(data)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field, location, messages } = res.body.errors[0];
          expect(field).to.equal('description');
          expect(location).to.equal('body');
          expect(messages).to.include('"description" must be a string');
        });
    });

    it('should report error "Ad does not exist" when ad group does not exists', () => {
      return request(app)
        .get('/ads/020202020202020202020202')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Ad does not exist');
        });
    });
  });
});
