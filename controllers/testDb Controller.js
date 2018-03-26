const dbContent = require("../models/db");

module.exports.mainContent = function(req, res){
  res.send(dbContent);
};

module.exports.formatedContent = function (req,res) {
    res.render('home', {content: dbContent[0]});
};
