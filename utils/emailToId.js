const User = require('./../models/userModel');

module.exports = async emailList => {
  var idList = [];
  for (const email of emailList) {
    const user = await User.findOne({ email });
    if (user) {
      idList.push(user._id);
    } else {
      return ['None', email];
    }
  }
  return idList;
};
