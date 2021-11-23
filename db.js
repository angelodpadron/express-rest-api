const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
//mongoose.set("debug", process.env.DEBUG != undefined);

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

function open() {
  return new Promise((resolve, reject) => {
    if (process.env.DEBUG != undefined) {
      let Mockgoose = require("mockgoose").Mockgoose;
      let mockgoose = new Mockgoose(mongoose);
      mockgoose
        .prepareStorage()
        .then(function () {
          mongoose.connect(
            `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PW}@node-rest-shop.haj7x.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
            opts,
            (err, res) => {
              if (err) return reject(err);
              resolve();
            }
          );
        })
        .catch(reject);
    } else {
      mongoose.connect(
        `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PW}@node-rest-shop.haj7x.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
        opts,
        (err, res) => {
          if (err) return reject(err);
          resolve();
        }
      );
    }
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { close, open };
