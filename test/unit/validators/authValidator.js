const chai = require('chai');
const { expect } = require('chai');

const { validate } = require('../../../validators/authValidator');

const should = chai.should();

describe('Auth Validator', () => {
  context('signin validation', () => {
    it('should be an array that contains two functions with correct properties', () => {
      const validateResult = validate('signin');
      validateResult.should.be.an('array').that.have.lengthOf(2);

      validateResult[0]
        .should.be.an('function')
        .that.have.property('builder');

      validateResult[0]
        .should.be.an('function')
        .that.have.property('builder')
        .that.have.property('fields').that.include('email');

      validateResult[0]
        .should.be.an('function')
        .that.have.property('builder')
        .that.have.property('locations').that.eql(['body']);

      validateResult[0]
        .should.be.an('function')
        .that.have.property('builder')
        .that.have.property('message').that.equal('Invalid email');

      validateResult[1]
        .should.be.an('function')
        .that.have.property('builder');

      validateResult[1]
        .should.be.an('function')
        .that.have.property('builder')
        .that.have.property('fields').that.include('password');

      validateResult[1]
        .should.be.an('function')
        .that.have.property('builder')
        .that.have.property('locations').that.eql(['body']);

      validateResult[1]
        .should.be.an('function')
        .that.have.property('builder')
        .that.have.property('message').that.is.an('undefined');
    });
    it('should be an empty array', () => {
      const validateResult = validate('invalidValue');
      // eql the same as deep.equal
      expect(validateResult).to.be.an('array').that.eql([]);
      // or
      // expect(validateResult).to.be.an('array').to.have.lengthOf(0);
    });
  });
});
