require('dotenv').config();
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const { expect, assert } = require('chai');

const HttpError = require('../../../core/errors/httpError');
const { User } = require('../../../models');
const Jwt = require('../../../core/services/Jwt');

chai.use(chaiAsPromised);
chai.use(sinonChai);

const should = chai.should();

describe('User Service', () => {
  let UserService;

  context('signin', () => {
    let userModelStub;
    let generateTokenSpy;
    let signin;

    before(() => {
      userModelStub = sinon.stub(User, 'query').returns({
        first: sinon.stub().resolves({
          id: 1,
          email: 'mail@mail.com',
          password: '$2a$10$dFLCAvDcApcWWgrLR0W6kuJhMtekRzHuNc/Jn/HTK/6C4HhhDeWPm',
          firstName: 'First Name',
          lastName: 'Last Name',
          createdAt: new Date('2020-04-17 11:10:00')
        }),
        where: sinon.stub().returnsThis(),
        patch: sinon.stub().resolves()
      });

      ({ signin } = proxyquire('../../../services/UserService', {
        User: userModelStub
      }));
    });

    it('should only call function once', async () => {
      const signinData = {
        email: 'mail@mail.com',
        password: '123456'
      };

      generateTokenSpy = sinon.spy(Jwt, 'generateToken');

      // cannot work with stub togather but without stub need an database connection
      // userModelSpy = sinon.spy(User, 'query');

      await signin(signinData);

      assert(User.query.calledWith());
      expect(User.query.called).to.equal(true);
      User.query.calledTwice.should.equal(true);
      User.query().where.calledTwice.should.equal(true);
      expect(User.query().where().first.calledOnce).to.equal(true);
      // withArgs work in pair with calledNumber, withArgs count numbers of method calls with specific args
      // .withArgs({ email: 'mail@mail.com' }).calledTwice will fail
      assert(User.query().where.withArgs({ email: 'mail@mail.com' }).calledOnce);
      assert(User.query().where.withArgs({ id: 1 }).calledOnce);
      // calledWith check if method was called at least once with specified args
      assert(User.query().where.calledWith({ email: 'mail@mail.com' }));
      assert(User.query().where.calledWith({ id: 1 }));

      sinon.assert.calledOnce(generateTokenSpy); // Why not work?
      // generateTokenSpy.should.have.been.calledOnce();
      generateTokenSpy.restore();
    });

    after(() => {
      userModelStub.restore();
    });
  });

  context('signup', () => {
    let userModelStub;
    let userModelSpy;

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

    it('should only call signup once', async () => {
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

      userModelSpy = sinon.spy(UserService, 'signup');

      const user = {
        email: 'mail@mail.com',
        password: '123456',
        firstName: 'First Name',
        lastName: 'Last Name'
      };

      await UserService.signup(user);

      userModelSpy
        .should.have.been.calledOnce
        .and.been.calledWith(user);

      userModelSpy.restore();
    });

    // it('should only call the database once', async () => {
    //   userModelStub = sinon.stub(User, 'query').returns({
    //     insert: sinon.stub().resolves({
    //       id: 1,
    //       email: 'mail@mail.com',
    //       password: '123456',
    //       firstName: 'First Name',
    //       lastName: 'Last Name',
    //       createdAt: new Date('2020-04-17 11:10:00')
    //     }),
    //     where: sinon.stub().returnsThis(),
    //     count: sinon.stub().resolves([{ count: 0 }])
    //   });

    //   UserService = proxyquire('../../../services/UserService', {
    //     User: userModelStub
    //   });

    //   userModelSpy = sinon.spy(User, 'query'); // cannot spy stubbed function

    //   const user = {
    //     email: 'mail@mail.com',
    //     password: '123456',
    //     firstName: 'First Name',
    //     lastName: 'Last Name'
    //   };

    //   await UserService.signup(user);

    //   userModelSpy
    //     .should.have.been.calledOnce
    //     .and.been.calledWith(user);

    //   userModelSpy.restore();
    // });

    // it('should only call the database once', async () => {
    //   const userModelMock = sinon.mock(User);

    //   // work only for one method from mock object
    //   // how to work with a chain ???
    //   // https://github.com/underscopeio/sinon-mongoose/issues/27   for mongodb
    //   userModelMock.expects('query').withExactArgs().once();
    //   // console.log('res ', res);

    //   UserService = proxyquire('../../../services/UserService', {
    //     User: userModelMock
    //   });

    //   const user = {
    //     email: 'mail@mail.com',
    //     password: '123456',
    //     firstName: 'First Name',
    //     lastName: 'Last Name'
    //   };

    //   await UserService.signup(user);

    //   userModelMock.verify();

    //   userModelMock.restore();
    // });

    afterEach(() => {
      userModelStub.restore();
    });
  });
});
