const chai = require('chai'), chaiHTTP = require('chai-http');

const app = require('../webserver/server');

chai.use(chaiHTTP);

let expect = chai.expect;

describe('Test Translations', function() {
  it('Languages selected: responds with a JSON and status 200', function(done) {
    chai.request(app)
      .get('/webserver/translateText?text=hello&languageToTranslateTo=German&languageToTranslateFrom=English&isFavourite=False')
      .end(function(err, res) {
        expect(res).to.be.json.and.to.include({"text": '{"translatedText":"Hallo","languageTranslatedFrom":"English","languageTranslatedTo":"German"}' }).and.have.status(200);
        done();
        });
    });
  it('Favourite Translation, Languages selected: responds with a JSON and status 200', function(done) {
    chai.request(app)
      .get('/webserver/translateText?text=hello&languageToTranslateTo=German&languageToTranslateFrom=English&isFavourite=True')
      .end(function(err, res) {
        expect(res).to.be.json.and.to.include({"text": '{"translatedText":"Hallo","languageTranslatedFrom":"English","languageTranslatedTo":"German"}' }).and.have.status(200);
        done();
          });
      });
  it('Languages auto detected: responds with a JSON and status 200', function(done) {
    chai.request(app)
      .get('/webserver/translateText?text=hallo meine Freunde&languageToTranslateTo=auto&languageToTranslateFrom=auto&isFavourite=False')
      .end(function(err, res) {
        expect(res).to.be.json.and.to.include({"text": '{"translatedText":"Hello my friends","languageTranslatedFrom":"German","languageTranslatedTo":"English"}' }).and.have.status(200);
        done();
        });
      });
  it('Favourite Translation, Languages auto detected: responds with a JSON and status 200', function(done) {
    chai.request(app)
      .get('/webserver/translateText?text=hallo meine Freunde&languageToTranslateTo=auto&languageToTranslateFrom=auto&isFavourite=True')
      .end(function(err, res) {
        expect(res).to.be.json.and.to.include({"text": '{"translatedText":"Hello my friends","languageTranslatedFrom":"German","languageTranslatedTo":"English"}' }).and.have.status(200);
        done();
        });
      });
    });

describe('Previous Translations', function() {
  it('Get previous translations: Fails and reponse with error 404, user not signed it', function(done) {
    chai.request(app)
      .get('/webserver/getPreviousTranslations')  // TODO include .redirect test
      .end(function(err, res) {
        expect(res).to.have.status(404);
        done();
        });
    });
  it('View user details: Not authorized as user is not logged in', function(done) {
    chai.request(app)
      .get('/api/hello')
      .end(function(err, res) {
        expect(res).to.have.status(401);  // TODO include .redirect test
        done();
        });
      });
    });

//TODO Database tests
