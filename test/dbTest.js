'use strict'
const chai = require('chai'), chaiHTTP = require('chai-http');

const db = require('../database/databaseMethods');

chai.use(chaiHTTP);

let expect = chai.expect;

describe('Test DB insertions', function() {
  it('Inserts test user into DB', function(done) {
    db.addTranslation(1, "auto", "auto", "hola", "Hey", true); //Use basic ID
    let rows = db.viewAllTranslations(1)
    expect(rows.length == 1);  //testing 1 translation has been added into table
    done();
  });
    it('Tests all records have been deleted, remove translations works', function(done) {
      let rows = db.removeUsersTranslations(1)
      expect(rows.length == 0);  //test translation removed
      done();
    });
  });
