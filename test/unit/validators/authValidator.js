const chai = require('chai');
const { expect } = require('chai');

const { validate } = require('../../../validators/authValidator');

const should = chai.should();

describe('Auth Validator', () => {
  context('signin validation', () => {
    it('should be an array that contains two functions with correct properties', () => {
      const validateResult = validate('signin');
      validateResult.should.be.an('array').that.have.lengthOf(2);

      const vr1Builder = validateResult[0].should.be.an('function')
        .that.have.property('builder');
      vr1Builder.that.have.property('fields').that.include('email');
      vr1Builder.that.have.property('locations').that.eql(['body']);
      vr1Builder.that.have.property('message').that.equal('Invalid email');

      const vr2Builder = validateResult[1].should.be.an('function')
        .that.have.property('builder');
      vr2Builder.that.have.property('fields').that.include('password');
      vr2Builder.that.have.property('locations').that.eql(['body']);
      vr2Builder.that.have.property('message').that.is.an('undefined');
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
