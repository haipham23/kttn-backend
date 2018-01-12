const urlify = require('urlify').create({
  spaces: '-',
  nonPrintable: '-',
  trim: true
});

const uniqid = require('uniqid');

const generateId = (name) => (
  uniqid
    .time(urlify(name) + '-')
    .toLowerCase()
);

module.exports = {
  generateId
};
