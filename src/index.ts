import { MY_CONSTANTS } from "./backend/defines/constants";
import { sayHello } from "./backend/services/hello";

import http from "http";
import fs from "fs";
import { exec, ExecException } from "child_process";

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', ['POST', 'OPTIONS']);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  console.log("REQUEST");
  if (req.method === 'OPTIONS') {
    // Handle preflight request
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Length': 0
    });
    res.end();
  } else if (req.method === 'POST' && req.url === '/upload') {
    console.log("PDF CONVERSION");

    if (req.headers['content-type'] !== 'application/pdf') {
      console.log("ERROR: content-type is not application/pdf");
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end('Invalid Content-Type');
      return;
    }

    console.log("PIPE");
    const file = fs.createWriteStream('./in.pdf', { encoding: 'binary' });
    req.pipe(file);

    file.on('finish', () => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('File uploaded successfully!');
      console.log("UPLOAD AND SAVE: SUCCESS");
      exec("reduce-pdf-size-gs.cmd", (err: ExecException | null, stdout: string, stderr: string) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(stdout);
      });
    });
  } else if (req.url === '/hello') {
    sayHello(res);
  }
  else {
    console.log("ERROR: wrong url");
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(MY_CONSTANTS.MY_SERVER_PORT, () => {
  console.log(`Server running on port ${MY_CONSTANTS.MY_SERVER_PORT}`);
});