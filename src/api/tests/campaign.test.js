/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const { some } = require('lodash');
const app = require('../../index');
const Campaign = require('../models/campaign.model');

describe('Campaign API', async () => {
  beforeEach(async () => {
    testCampaignData = {
      status: 'Pending',
      goal: 'Branding',
      total_budget: 100,
      name: 'Test Campaign',
    };

    testCampaign = new Campaign(testCampaignData);
    testCampaign = await testCampaign.save();
  });

  afterEach(async () => {
    await testCampaign.remove();
  });


  describe('GET /campaigns', () => {
    it('should get all campaigns', () => {
      return request(app)
        .get('/campaigns')
        .expect(httpStatus.OK)
        .then(async (res) => {
          const count = await Campaign.count();
          const includesTestCampaign = some(res.body, testCampaignData);

          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(count);
          expect(includesTestCampaign).to.be.true;
        });
    });

    it('should get filter campaigns by status', () => {
      return request(app)
        .get('/campaigns?status=Pending')
        .expect(httpStatus.OK)
        .then(async (res) => {
          const count = await Campaign.count({ status: 'Pending' });
          const includesTestCampaign = some(res.body, testCampaignData);

          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(count);
          expect(includesTestCampaign).to.be.true;
        });
    });

    it('should get empty list by invalid status', () => {
      return request(app)
        .get('/campaigns?status=teststatus')
        .expect(httpStatus.OK)
        .then(async (res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(0);
        });
    });
  });

  describe('GET /campaigns/:id', () => {
    it('should get campaign', async () => {
      return request(app)
        .get(`/campaigns/${testCampaign._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.include(testCampaignData);
        });
    });

    it('should report error "Campaign does not exist" when campaign does not exists', () => {
      return request(app)
        .get('/campaigns/020202020202020202020202')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Campaign does not exist');
        });
    });

    it('should report error "Campaign does not exist" when id is not a valid ObjectID', () => {
      return request(app)
        .get('/campaigns/test')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.equal('Campaign does not exist');
        });
    });
  });

  describe('PUT /campaigns/:id', () => {
    it('should update campaign', async () => {
      const updateData = {
        status: 'Updated',
        goal: 'Updated Branding',
        total_budget: 120,
        name: 'Updated Test Campaign',
      };

      return request(app)
        .put(`/campaigns/${testCampaign._id}`)
        .send(updateData)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.include(updateData);
        });
    });

    it('should report error "Validation Error" ', async () => {
      const data = {
        total_budget: 'test',
      };

      return request(app)
        .put(`/campaigns/${testCampaign._id}`)
        .send(data)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field, location, messages } = res.body.errors[0];
          expect(field).to.equal('total_budget');
          expect(location).to.equal('body');
          expect(messages).to.include('"total_budget" must be a number');
        });
    });

    it('should report error "Campaign does not exist" when campaign does not exists', () => {
      return request(app)
        .get('/campaigns/020202020202020202020202')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Campaign does not exist');
        });
    });
  });
});
