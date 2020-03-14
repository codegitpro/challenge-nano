const express = require('express');
const validate = require('express-validation');
const campaignController = require('../controllers/campaign.controller');
const adgroupController = require('../controllers/adgroup.controller');
const adController = require('../controllers/ad.controller');
const statController = require('../controllers/stat.controller');
const { updateCampaign } = require('../validations/campaign.validation');
const { updateAdgroup } = require('../validations/adgroup.validation');
const { updateAd } = require('../validations/ad.validation');
const { updateStat } = require('../validations/stat.validation');


const router = express.Router();


/**
 * GET /docs
 */
router.use('/docs', express.static('docs'));

/**
 * Load campaign, adgroup, ad and stat when API with route parameter is hit
 */
router.param('campaignId', campaignController.load);
router.param('adgroupId', adgroupController.load);
router.param('adId', adController.load);
router.param('statId', statController.load);

router
  .route('/campaigns')
  /**
   * @api {get} /campaigns List Campaigns
   * @apiDescription Get a list of campaigns
   * @apiVersion 1.0.0
   * @apiName ListCampaigns
   * @apiGroup Campaigns
   * @apiPermission user
   *
   * @apiParam  {String}             [status]     The status of campaigns
   *
   * @apiSuccess {Object[]} campaigns               List of campaigns.
   * @apiSuccess {String}   campaigns.id            Campaign id.
   * @apiSuccess {String}   campaigns.name          Campaign name.
   * @apiSuccess {String}   campaigns.status        Campaign status.
   * @apiSuccess {String}   campaigns.goal          Campaign goal.
   * @apiSuccess {Number}   campaigns.total_budget  Campaign total budget.
   */
  .get(campaignController.list);

router
  .route('/campaigns/:campaignId')
  /**
   * @api {get} /campaigns/:id Get Campaign
   * @apiDescription Get a campaign information
   * @apiVersion 1.0.0
   * @apiName GetCampaign
   * @apiGroup Campaigns
   * @apiPermission user
   *
   * @apiSuccess {String}   id            Campaign id
   * @apiSuccess {String}   name          Campaign name
   * @apiSuccess {String}   status        Campaign status
   * @apiSuccess {String}   goal          Campaign goal
   * @apiSuccess {Number}   total_budget  Campaign total budget
   *
   * @apiError (Not Found 404)    NotFound     Campaign does not exist
   */
  .get(campaignController.get)
  /**
   * @api {put} /campaigns/:id Update Campaign
   * @apiDescription Update some fields of a campaign document
   * @apiVersion 1.0.0
   * @apiName UpdateCampaign
   * @apiGroup Campaigns
   * @apiPermission user
   *
   * @apiParam {String}   [id]            Campaign id
   * @apiParam {String}   [name]          Campaign name
   * @apiParam {String}   [status]        Campaign status
   * @apiParam {String}   [goal]          Campaign goal
   * @apiParam {Number}   [total_budget]  Campaign total budget
   *
   * @apiSuccess {String}   id            Campaign id
   * @apiSuccess {String}   name          Campaign name
   * @apiSuccess {String}   status        Campaign status
   * @apiSuccess {String}   goal          Campaign goal
   * @apiSuccess {Number}   total_budget  Campaign total budget
   *
   * @apiError (Bad Request 400)    ValidationError  Some parameters may contain invalid values
   * @apiError (Not Found 404)      NotFound     Campaign does not exist
   */
  .put(validate(updateCampaign), campaignController.update);

router
  .route('/campaigns/:campaignId/adgroups')
  /**
   * @api {get} /campaigns/:id/adgroups List Ad groups
   * @apiDescription Get a list of ad groups of the campaign
   * @apiVersion 1.0.0
   * @apiName ListAdgroups
   * @apiGroup Ad groups
   * @apiPermission user
   *
   * @apiSuccess {Object[]}               adgroups              List of ad groups
   * @apiSuccess {String}                 adgroups.id           Ad group id
   * @apiSuccess {String}                 adgroups.name         Name of the ad group
   * @apiSuccess {Number[]}               adgroups.age_range    Age range of ad group
   * @apiSuccess {String[]}               adgroups.locations    List of locations of the ad group
   * @apiSuccess {String[]}               adgroups.keywords     List of keywords of the ad group
   * @apiSuccess {String[]=Male,Female}   adgroups.genders      List of genders of the ad group
   */
  .get(adgroupController.list);

router
  .route('/campaigns/:campaignId/ads')
  /**
   * @api {get} /campaigns/:id/ads List ads
   * @apiDescription Get a list of ads of the campaign
   * @apiVersion 1.0.0
   * @apiName ListAds
   * @apiGroup Ads
   * @apiPermission user
   *
   * @apiSuccess {Object[]}       ads                 List of ads
   * @apiSuccess {String}         ads.id              Ad id
   * @apiSuccess {String}         ads.url             Ad url
   * @apiSuccess {String}         ads.image           Ad image
   * @apiSuccess {String}         ads.header          Ad header
   * @apiSuccess {String}         ads.description     Ad description
   */
  .get(adController.list);

router
  .route('/adgroups/:adgroupId')
  /**
   * @api {get} /adgroups/:id Get Ad group
   * @apiDescription Get a ad group information
   * @apiVersion 1.0.0
   * @apiName GetAdgroup
   * @apiGroup Ad groups
   * @apiPermission user
   *
   * @apiSuccess {String}                 id                  Ad group id
   * @apiSuccess {String}                 name                Name of the ad group
   * @apiSuccess {Number[]}               age_range           Age range of ad group
   * @apiSuccess {String[]}               locations           List of locations of the ad group
   * @apiSuccess {String[]}               keywords   List of keywords of the ad group
   * @apiSuccess {String[]=Male,Female}   genders             List of genders of the ad group
   *
   * @apiError (Not Found 404)    NotFound     Ad group does not exist
   */
  .get(adgroupController.get)
  /**
   * @api {put} /adgroups/:id Update Ad group
   * @apiDescription Update some fields of a ad group document
   * @apiVersion 1.0.0
   * @apiName UpdateAdgroup
   * @apiGroup Ad groups
   * @apiPermission user
   *
   * @apiParam {String}                 [id]                  Ad group id
   * @apiParam {String}                 [name]                Name of the ad group
   * @apiParam {Number[]}               [age_range]           Age range of ad group
   * @apiParam {String[]}               [locations]           List of locations of the ad group
   * @apiParam {String[]}               [adgroups.keywords]   List of keywords of the ad group
   * @apiParam {String[]=Male,Female}   [genders]             List of genders of the ad group
   *
   * @apiSuccess {String}                 id                  Ad group id
   * @apiSuccess {String}                 name                Name of the ad group
   * @apiSuccess {Number[]}               age_range           Age range of ad group
   * @apiSuccess {String[]}               locations           List of locations of the ad group
   * @apiSuccess {String[]}               adgroups.keywords   List of keywords of the ad group
   * @apiSuccess {String[]=Male,Female}   genders             List of genders of the ad group
   *
   * @apiError (Bad Request 400)    ValidationError  Some parameters may contain invalid values
   * @apiError (Not Found 404)      NotFound     Ad group does not exist
   */
  .put(validate(updateAdgroup), adgroupController.update);

router
  .route('/ads/:adId')
  /**
   * @api {get} /ads/:id Get Ad
   * @apiDescription Get an ad information
   * @apiVersion 1.0.0
   * @apiName GetAd
   * @apiGroup Ads
   * @apiPermission user
   *
   * @apiSuccess {String}         id              Ad id
   * @apiSuccess {String}         url             Ad url
   * @apiSuccess {String}         image           Ad image
   * @apiSuccess {String}         header          Ad header
   * @apiSuccess {String}         description     Ad description
   *
   * @apiError (Not Found 404)    NotFound     Ad does not exist
   */
  .get(adController.get)
  /**
   * @api {put} /adgroups/:id Update Ad
   * @apiDescription Update some fields of a ad document
   * @apiVersion 1.0.0
   * @apiName UpdateAd
   * @apiGroup Ads
   * @apiPermission user
   *
   * @apiParam {String}         [id]              Ad id
   * @apiParam {String}         [url]             Ad url
   * @apiParam {String}         [image]           Ad image
   * @apiParam {String}         [header]          Ad header
   * @apiParam {String}         [description]     Ad description
   *
   * @apiSuccess {String}         id              Ad id
   * @apiSuccess {String}         url             Ad url
   * @apiSuccess {String}         image           Ad image
   * @apiSuccess {String}         header          Ad header
   * @apiSuccess {String}         description     Ad description
   *
   * @apiError (Bad Request 400)    ValidationError  Some parameters may contain invalid values
   * @apiError (Not Found 404)      NotFound     Ad group does not exist
   */
  .put(validate(updateAd), adController.update);

router
  .route('/ads/:adId/stats')
  /**
   * @api {get} /ads/:id/stats List Statistics
   * @apiDescription Get a list of statistics of the ad
   * @apiVersion 1.0.0
   * @apiName ListStatistics
   * @apiGroup Statistics
   * @apiPermission user
   *
   * @apiParam  {Date}             [start]          Start date of the statistics
   * @apiParam  {Date}             [end]            Endn date of the statistics
   *
   * @apiSuccess {Object[]}           statistics                     List of statistics
   * @apiSuccess {Number}             statistics.clicks              Ad clicks
   * @apiSuccess {Number}             statistics.cost                Ad cost
   * @apiSuccess {Number}             statistics.impressions         Ad impressions
   * @apiSuccess {Date}               statistics.date                Ad date
   * @apiSuccess {Number}             statistics.cost_per_click      Ad cost per click
   */
  .get(statController.list);

router
  .route('/stats/:statId')
  /**
   * @api {get} /stats/:id Get Statistics
   * @apiDescription Get an statistics information
   * @apiVersion 1.0.0
   * @apiName GetStatistics
   * @apiGroup Statistics
   * @apiPermission user
   *
   * @apiSuccess {Number}             clicks              Ad clicks
   * @apiSuccess {Number}             cost                Ad cost
   * @apiSuccess {Number}             impressions         Ad impressions
   * @apiSuccess {Date}               date                Ad date
   * @apiSuccess {Number}             cost_per_click      Ad cost per click
   *
   * @apiError (Not Found 404)    NotFound     Statistics does not exist
   */
  .get(statController.get)
  /**
   * @api {put} /stats/:id Update Statistics
   * @apiDescription Update some fields of statistics document
   * @apiVersion 1.0.0
   * @apiName UpdateStatistics
   * @apiGroup Statistics
   * @apiPermission user
   *
   * @apiSuccess {Number}             [clicks]              Ad clicks
   * @apiSuccess {Number}             [cost]                Ad cost
   * @apiSuccess {Number}             [impressions]         Ad impressions
   * @apiSuccess {Date}               [date]                Ad date
   * @apiSuccess {Number}             [cost_per_click]      Ad cost per click
   *
   * @apiSuccess {Number}             clicks              Ad clicks
   * @apiSuccess {Number}             cost                Ad cost
   * @apiSuccess {Number}             impressions         Ad impressions
   * @apiSuccess {Date}               date                Ad date
   * @apiSuccess {Number}             cost_per_click      Ad cost per click
   *
   * @apiError (Bad Request 400)    ValidationError  Some parameters may contain invalid values
   * @apiError (Not Found 404)      NotFound     Ad group does not exist
   */
  .put(validate(updateStat), statController.update);


module.exports = router;
