import fs from "fs";
import request from "request";

var download = function (uri, filename, callback) {
    return new Promise((resolve, reject) => {
        request.head(uri, function (err, res, body) {
            try {
                request(uri)
                    .pipe(fs.createWriteStream(filename))
                    .on("close", function () {
                        console.log(`${uri} image download!!`);
                        resolve(true);
                    });
            } catch (error) {
                reject(false);
            }
        });
    });
};

export { download };
