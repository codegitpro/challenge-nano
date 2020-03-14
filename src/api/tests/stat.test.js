/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const { some } = require('lodash');
const app = require('../../index');
const Stat = require('../models/stat.model');
const Ad = require('../models/ad.model');

describe('Stats API', async () => {
  beforeEach(async () => {
    testAdData = {
      description: 'Test Ad 1',
      url: 'nanos.ai',
      image: 'test_ad_image_1.jpg',
      header: 'Test Header 1',
    };

    testStatsData = [
      {
        clicks: 49,
        cost: 46,
        date: new Date('2020-01-13 13:11:06').toISOString(),
        impressions: 6780,
      },
      {
        clicks: 34,
        cost: 23,
        date: new Date('2020-01-13 13:11:06').toISOString(),
        impressions: 4354,
      },
      {
        clicks: 49,
        cost: 46,
        date: new Date('2020-01-13 13:11:06').toISOString(),
        impressions: 5432,
      },
    ];

    testStats = [];
    for (let i = 0; i < testStatsData.length; i++) {
      testStat = new Stat(testStatsData[i]);
      testStat = await testStat.save();
      testStats.push(testStat);
    }

    testAd = new Ad(testAdData);
    testAd.stats = testStats;
    testAd = await testAd.save();

    testStat = testStats[0];
  });

  afterEach(async () => {
    for (let i = 0; i < testStats.length; i++) {
      await testStats[i].remove();
    }
    await testAd.remove();
  });


  describe('GET /ads/:id/stats', () => {
    it('should get all stats', () => {
      return request(app)
        .get(`/ads/${testAd._id}/stats`)
        .expect(httpStatus.OK)
        .then(async (res) => {
          let includesTestStats = true;
          testStatsData.forEach(d => includesTestStats = includesTestStats && some(res.body, d));

          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(3);
          expect(includesTestStats).to.be.true;
        });
    });


    it('should report error "Ad does not exist" when ad does not exists', () => {
      return request(app)
        .get('/ads/020202020202020202020202/stats')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Ad does not exist');
        });
    });

    it('should report error "Ad does not exist" when id is not a valid ObjectID', () => {
      return request(app)
        .get('/ads/test/stats')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.equal('Ad does not exist');
        });
    });
  });

  describe('GET /stats/:id', () => {
    it('should get stat', async () => {
      return request(app)
        .get(`/stats/${testStat._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.include(testStatsData[0]);
        });
    });

    it('should report error "Stat does not exist" when stat does not exists', () => {
      return request(app)
        .get('/stats/020202020202020202020202')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Stat does not exist');
        });
    });

    it('should report error "Stat does not exist" when id is not a valid ObjectID', () => {
      return request(app)
        .get('/stats/test')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.equal('Stat does not exist');
        });
    });
  });

  describe('PUT /stats/:id', () => {
    it('should update stat', async () => {
      const updateData = {
        clicks: 32,
        cost: 54,
        date: new Date('2019-01-13 13:11:06').toISOString(),
        impressions: 6782,
      };

      return request(app)
        .put(`/stats/${testStat._id}`)
        .send(updateData)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.deep.include(updateData);
        });
    });

    it('should report error "Validation Error" ', async () => {
      const data = {
        cost: 'asdf',
      };

      return request(app)
        .put(`/stats/${testStat._id}`)
        .send(data)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field, location, messages } = res.body.errors[0];
          expect(field).to.equal('cost');
          expect(location).to.equal('body');
          expect(messages).to.include('"cost" must be a number');
        });
    });

    it('should report error "Stat does not exist" when stat does not exists', () => {
      return request(app)
        .get('/stats/020202020202020202020202')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Stat does not exist');
        });
    });
  });
});
