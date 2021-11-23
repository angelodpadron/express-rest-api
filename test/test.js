process.env.DEBUG = true;

const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const conn = require("../db");
const app = require("../app");

chai.use(chaiHttp);

describe("Products Test Suite", function () {
  before(function (done) {
    conn
      .open()
      .then(() => done())
      .catch(done);
  });

  after(function (done) {
    conn
      .close()
      .then(() => done())
      .catch(done);
  });

  it("No products on first call", function (done) {
    chai
      .request(app)
      .get("/products")
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.count).to.equal(0);
        expect(res.body.products.length).to.equal(0);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  
});
