const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');

const { User } = require('../../../models');

chai.use(sinonChai);

describe('User Service', () => {
  // TODO maybe add global for crypto
  let UserService;

  context('signup', () => {
    let userModelStub;
    // let userModelErrorStub;

    before(() => {
      // https://github.com/Vincit/objection.js/issues/1477
      // https://stackoverflow.com/questions/37948135/how-do-i-stub-a-chain-of-methods-in-sinon
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
      // userModelErrorStub = sinon.stub(User, 'query').returns({
      //   where: sinon.stub().returnsThis(),
      //   count: sinon.stub().resolves([{ count: 1 }])
      // });
      // dbStub = sinon.stub(User, 'query').resolves({}); // work only for one chain
      UserService = proxyquire('../../../services/UserService', {
        User: userModelStub
      });
    });

    it('should return created user object', async () => {
      // before(() => {
      //   UserService = proxyquire('../../../services/UserService', {
      //     User: userModelStub
      //   });
      // });

      const user = {
        email: 'mail@mail.com',
        password: '123456',
        firstName: 'First Name',
        lastName: 'Last Name'
      };

      const res = await UserService.signup(user);
      res.should.deep.equal({
        id: 1,
        email: 'mail@mail.com',
        password: '123456',
        firstName: 'First Name',
        lastName: 'Last Name',
        createdAt: new Date('2020-04-17 11:10:00')
      });
    });

    // it('should throw email already exists error', async () => {
    //   UserService = proxyquire('../../../services/UserService', {
    //     User: userModelErrorStub
    //   });
    //   const user = {
    //     email: 'mail@mail.com',
    //     password: '123456',
    //     firstName: 'First Name',
    //     lastName: 'Last Name'
    //   };

    //   const res = await UserService.signup(user);
    //   res.should.deep.equal({
    //     id: 1,
    //     email: 'mail@mail.com',
    //     password: '123456',
    //     firstName: 'First Name',
    //     lastName: 'Last Name',
    //     createdAt: new Date('2020-04-17 11:10:00')
    //   });
    // });

    after(() => {
      userModelStub.restore();
      // userModelErrorStub.restore();
    });
  });
});
