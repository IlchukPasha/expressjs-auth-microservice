const chai = require('chai');

const User = require('../../../models/User');

const should = chai.should();

describe('User model', () => {
  context('Visable fields', () => {
    it('should have correct visable fields', () => {
      User.visible.should.deep.equal([
        'id',
        'email',
        'firstName',
        'lastName',
        'createdAt'
      ]);
    });
  });
});
