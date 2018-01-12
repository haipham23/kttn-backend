const { expect } = require('chai');

const { generateId } = require('./generator');

describe('generateId()', () => {
  it('should normalize name and return unique id', () => {
    const id = generateId('Ông Tu');

    expect(id).to.contain('ong-tu');
    expect(id).to.have.lengthOf(15);
  });
});
