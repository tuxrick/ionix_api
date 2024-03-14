const requests = require('../../utils/requests');

module.exports = {
  test: async (req, res) => {
    return requests.success_response(req, res, {}, "success request", "success");
  },
}