const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const { expect } = require('chai');

const HttpError = require('../../../core/errors/httpError');
const { User } = require('../../../models');

chai.use(chaiAsPromised);
chai.use(sinonChai);

const should = chai.should();

describe('User Service', () => {
  let UserService;

  context('signup', () => {
    let userModelStub;

    it('should return created user object', async () => {
      // https://github.com/Vincit/objection.js/issues/1477
      // https://stackoverflow.com/questions/37948135/how-do-i-stub-a-chain-of-methods-in-sinon

      // dbStub = sinon.stub(User, 'query').resolves({}); // work only for one chain
      userModelStub = sinon.stub(User, 'query').returns({
        insert: sinon.stub().resolves({
          id: 1,
          email: 'mail@mail.com',
          password: '123456',
          firstName: 'First Name',
          lastName: 'Last Name',
          createdAt: new Date('2020-04-17 11:10:00')
        }),
        where: sinon.stub().returnsThis(),
        count: sinon.stub().resolves([{ count: 0 }])
      });
      UserService = proxyquire('../../../services/UserService', {
        User: userModelStub
      });

      const user = {
        email: 'mail@mail.com',
        password: '123456',
        firstName: 'First Name',
        lastName: 'Last Name'
      };

      const result = await UserService.signup(user);
      result.should.deep.equal({
        id: 1,
        email: 'mail@mail.com',
        password: '123456',
        firstName: 'First Name',
        lastName: 'Last Name',
        createdAt: new Date('2020-04-17 11:10:00')
      });
    });

    it('should throw email already exists error', async () => {
      userModelStub = sinon.stub(User, 'query').returns({
        where: sinon.stub().returnsThis(),
        count: sinon.stub().resolves([{ count: 1 }])
      });
      UserService = proxyquire('../../../services/UserService', {
        User: userModelStub
      });

      const user = {
        email: 'mail@mail.com',
        password: '123456',
        firstName: 'First Name',
        lastName: 'Last Name'
      };

      // https://stackoverflow.com/questions/21587122/mocha-chai-expect-to-throw-not-catching-thrown-errors
      // https://stackoverflow.com/questions/45466040/verify-that-an-exception-is-thrown-using-mocha-chai-
      // and-async-await
      // expect(UserService.signup.bind(UserService, user)).to.throw(Error); // work for not async

      await expect(UserService.signup(user)).to.be.eventually.rejectedWith(HttpError);
    });

    it('should only call the database once', async () => {
      const userModelMock = sinon.mock(User);

      // work only for one method from mock object
      // how to work with a chain ???
      // https://github.com/underscopeio/sinon-mongoose/issues/27   for mongodb
      userModelMock.expects('query').withExactArgs('').once();
      // console.log('res ', res);

      UserService = proxyquire('../../../services/UserService', {
        User: userModelMock
      });

      const user = {
        email: 'mail@mail.com',
        password: '123456',
        firstName: 'First Name',
        lastName: 'Last Name'
      };

      await UserService.signup(user);

      userModelMock.verify();

      userModelMock.restore();
    });

    afterEach(() => {
      userModelStub.restore();
    });
  });
});
