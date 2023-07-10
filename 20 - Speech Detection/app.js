const http = require("http");
const fs = require("fs");
const port = 3000;
const hostname = "127.0.0.1";

const server = http.createServer((req, res) => {
    const rs = fs.createReadStream( req.url === "/" ? "./index-FINISHED.html" : `.${req.url}`);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    rs.pipe(res);
})
;
server.listen(port, hostname, () => console.log(`Running ${hostname} at port ${port}`));
