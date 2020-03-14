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

describe('Adgroup API', async () => {
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

    testAdgroup1 = new Adgroup(testAdgroupData[0]);
    testAdgroup1 = await testAdgroup1.save();

    testAdgroup2 = new Adgroup(testAdgroupData[1]);
    testAdgroup2 = await testAdgroup2.save();

    testCampaign = new Campaign(testCampaignData);
    testCampaign.adgroups = [testAdgroup1, testAdgroup2];
    testCampaign = await testCampaign.save();
  });

  afterEach(async () => {
    await testAdgroup1.remove();
    await testAdgroup2.remove();
    await testCampaign.remove();
  });


  describe('GET /campaign/:id/adgroups', () => {
    it('should get all adgroups', () => {
      return request(app)
        .get(`/campaigns/${testCampaign.id}/adgroups`)
        .expect(httpStatus.OK)
        .then(async (res) => {
          let includesTestAdgroups = true;
          testAdgroupData.forEach((d) => {
            includesTestAdgroups = includesTestAdgroups && some(res.body, d);
          });

          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          expect(includesTestAdgroups).to.be.true;
        });
    });


    it('should report error "Campaign does not exist" when campaign does not exists', () => {
      return request(app)
        .get('/campaigns/020202020202020202020202/adgroups')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Campaign does not exist');
        });
    });

    it('should report error "Campaign does not exist" when id is not a valid ObjectID', () => {
      return request(app)
        .get('/campaigns/test/adgroups')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.equal('Campaign does not exist');
        });
    });
  });

  describe('GET /adgroups/:id', () => {
    it('should get adgroup', async () => {
      return request(app)
        .get(`/adgroups/${testAdgroup1._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.deep.include(testAdgroupData[0]);
        });
    });

    it('should report error "Adgroup does not exist" when ad group does not exists', () => {
      return request(app)
        .get('/adgroups/020202020202020202020202')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Adgroup does not exist');
        });
    });

    it('should report error "Adgroup does not exist" when id is not a valid ObjectID', () => {
      return request(app)
        .get('/adgroups/test')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.equal('Adgroup does not exist');
        });
    });
  });

  describe('PUT /adgroups/:id', () => {
    it('should update adgroup', async () => {
      const updateData = {
        age_range: [15, 23],
        name: 'Test Update',
        locations: ['London Update', 'Paris Update'],
        keywords: ['Nike Mercurial Update', 'Best boots Update'],
        genders: ['Female Update'],
      };

      return request(app)
        .put(`/adgroups/${testAdgroup1._id}`)
        .send(updateData)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.deep.include(updateData);
        });
    });

    it('should report error "Validation Error" ', async () => {
      const data = {
        age_range: 'asdf',
      };

      return request(app)
        .put(`/adgroups/${testAdgroup1._id}`)
        .send(data)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field, location, messages } = res.body.errors[0];
          expect(field).to.equal('age_range');
          expect(location).to.equal('body');
          expect(messages).to.include('"age_range" must be an array');
        });
    });

    it('should report error "Adgroup does not exist" when ad group does not exists', () => {
      return request(app)
        .get('/adgroups/020202020202020202020202')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Adgroup does not exist');
        });
    });
  });
});
