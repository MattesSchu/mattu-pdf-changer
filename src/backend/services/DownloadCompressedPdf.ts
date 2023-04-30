import { IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import url from "url";
import querystring from "querystring";

export async function downloadCompressedPdf(req: IncomingMessage, res: ServerResponse) {
  if (!req || req === undefined) {
    const msg = "error: req is not defined.";
    console.log(msg);
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end(msg);
    return;
  }

  const rUrl: string | undefined = req.url;
  if (!rUrl || rUrl === undefined) {
    const msg = "error: req url not defined.";
    console.log(msg);
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end(msg);
    return;
  }

  const query: string | null = url.parse(rUrl).query;
  if (!query) {
    const msg = "error: query is invalid.";
    console.log(msg);
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end(msg);
    return;
  }

  const params = querystring.parse(query);
  const fileName = params.fileName;
  const uuid = params.uuid;

  if (Array.isArray(fileName) || fileName === undefined) {
    const msg = "error: fileName is invalid.";
    console.log(msg);
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end(msg);
    return;
  }

  if (Array.isArray(uuid) || uuid === undefined) {
    const msg = "error: uuid is invalid.";
    console.log(msg);
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end(msg);
    return;
  }

  const filePath = `./temp/${uuid}/${fileName}`;
  const data = fs.readFileSync(filePath);

  res.setHeader('Content-Disposition', 'attachment; filename="file.pdf"');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Length', data.length);
  res.statusCode = 200;
  res.end(data);
  return;
}