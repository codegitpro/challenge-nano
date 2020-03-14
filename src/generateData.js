
const logger = require('./config/logger');

const Campaign = require('./api/models/campaign.model');
const Adgroup = require('./api/models/adgroup.model');
const Ad = require('./api/models/ad.model');
const Stat = require('./api/models/stat.model');

const data = require('./data');

const gnerateData = (db) => {
  db.on('open', async () => {
    try {
      // Clear existing collections
      await Campaign.deleteMany();
      await Adgroup.deleteMany();
      await Ad.deleteMany();
      await Stat.deleteMany();
  
      // Add data
      for (const campaignData of data.campaigns) {
        const adgroupsData = data.adgroups.filter(e => e.campaign_id === campaignData.id);
        const adgroups = [];
  
        for (const adgroupData of adgroupsData) {
          const adsData = data.ads.filter(e => e.ad_group_id === adgroupData.id);
          const ads = [];
          for (const adData of adsData) {
            const statsData = data.stats.filter(e => e.ad_id === adData.id);
  
            // Create stats
            const stats = [];
            for (const statData of statsData) {
              const stat = new Stat(statData);
              await stat.save();
              stats.push(stat._id);
            }
            // Create ads
            const ad = new Ad(adData);
            ad.stats = stats;
            await ad.save();
            ads.push(ad._id);
          }
  
          // Create adgroups
          const adgroup = new Adgroup(adgroupData);
          adgroup.ads = ads;
          await adgroup.save();
          adgroups.push(adgroup._id);
        }
  
        // Create Campaign
        const campaign = new Campaign(campaignData);
        campaign.adgroups = adgroups;
        await campaign.save();
      }
    } catch (e) {
      logger.error(e);
    }
  
    console.log('data generated...');
  });  
}

module.exports = gnerateData;