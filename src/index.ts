import http from 'http';
import { MY_CONSTANTS } from './backend/defines/constants';
import { sayHello } from './backend/services/hello';
import { compressWithGs } from './backend/services/CompressGs';
import { downloadCompressedPdf } from './backend/services/DownloadCompressedPdf';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', ['POST', 'OPTIONS']);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  console.log('REQUEST');
  if (req.method === 'OPTIONS') {
    // Handle preflight request
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Length': 0,
    });
    res.end();
  } else if (req.method === 'POST' && req.url === '/upload') {
    console.log('PDF CONVERSION');
    compressWithGs(req, res);
  } else if (req.method === 'GET' && req.url && req.url.startsWith('/download')) {
    console.log('PDF DOWNLOAD');
    downloadCompressedPdf(req, res);
  } else if (req.url === '/hello') {
    sayHello(res);
  } else {
    console.log('ERROR: wrong url');
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(MY_CONSTANTS.MY_SERVER_PORT, () => {
  console.log(`Server running on port ${MY_CONSTANTS.MY_SERVER_PORT}`);
});
