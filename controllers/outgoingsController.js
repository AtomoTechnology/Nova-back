const OutGoing = require('../models/outGoingModel');
const factory = require('./factoryController');

exports.Create = factory.CreateOne(OutGoing);
exports.GetAll = factory.GetAll(OutGoing);
exports.GetOne = factory.GetOne(OutGoing);
exports.DeleteOne = factory.DeleteOne(OutGoing);
exports.DeleteAll = factory.DeleteAll(OutGoing);
