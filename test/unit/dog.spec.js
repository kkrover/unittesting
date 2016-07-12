/* eslint-disable no-unused-expressions, no-underscore-dangle, func-names */
const expect = require('chai').expect;
const Dog = require('../../dst/models/dog');
const sinon = require('sinon');

describe('Dog', () => {
  beforeEach(() => {
    sinon.stub(Dog, 'find').yields(null, []);
  });

  afterEach(() => {
    Dog.find.restore();
  });

  describe('constructor', () => {
    it('should create a Dog', (done) => {
      const d = new Dog({ name: 'Fluffy',
                          age: 3,
                          health: 100,
                          toy: 'Bones' });
      d.validate(err => {
        expect(err).to.be.undefined;
        expect(d.name).to.equal('Fluffy');
        expect(d._id).to.be.ok;
        expect(d.dateCreated).to.be.ok;
        done();
      });
    });
    it('should NOT create a Dog - negative health', (done) => {
      const d = new Dog({ name: 'fido',
                          age: 3,
                          health: -50,
                          toy: 'Bones' });
      d.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create a Dog - missing name', (done) => {
      const d = new Dog({ age: 3,
                          health: 100,
                          toy: 'Bones' });
      d.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create a Dog - name too short', (done) => {
      const d = new Dog({ name: 'ab',
                          age: 3,
                          health: 100,
                          toy: 'Bones' });
      d.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create a Dog - invalid toy', (done) => {
      const d = new Dog({ name: 'Fido',
                          age: 3,
                          health: 100,
                          toy: 'cat' });
      d.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });

    it('should NOT create a Dog - duplicate dog name found', done => {
      Dog.find.yields(null, [{ name: 'max' }]);
      // this.stub(Dog, 'find').yields(null, [{ name: 'max' }]); // <--- Mock/Stub

      const d = new Dog({ name: 'max',
                          age: 3,
                          health: 100,
                          toy: 'Bones' });
      d.validate(err => {
        expect(err).to.be.ok;
        sinon.assert.calledWith(Dog.find, { name: 'max' });  // <--- Spy
        done();
      });
    });
  });

  describe('#feed', () => {
    // it('should add 10 to the dogs health', sinon.test(function (done) {
    //   const d = new Dog({ name: 'rex',
    //                        age: 3,
    //                        health: 50,
    //                        toy: 'Bones' });
    //   this.stub(d, 'save').yields(null, { health: 60 });
    //   d.feed((health) => {
    //     expect(health).to.equal(60);
    //     done();
    //   });
    // }));
    it('should add 10 to the dogs health', (done) => {
      const d = new Dog({ name: 'rex',
                          age: 3,
                          health: 50,
                          toy: 'Bones' });
      d.feed();
      expect(d.health).to.equal(60);
      done();
    });
    it('should add to dogs health and max out at 100', () => {
      const d = new Dog({ name: 'rex',
                          age: 3,
                          health: 95,
                          toy: 'Bones' });
      d.feed();
      expect(d.health).to.equal(100);
    });
  });
});
