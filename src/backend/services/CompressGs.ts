import { exec } from 'child_process';
import { IncomingMessage, ServerResponse } from 'http';
import { IncomingForm, Files, Fields } from 'formidable';
import fs from 'fs';

export interface PdfResultDto {
  fileName: string;
  uuid: string;
}

async function executeCommand(uuid: string, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const cmd = `reduce-pdf-size-gs.cmd ${uuid} ${filename}`;
    console.log(cmd);
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      console.log(stdout);
      resolve('Success');
    });
  });
}

function copyPpf(fields: Fields, files: Files): PdfResultDto {
  const expectedFields = ['uuid'];
  for (const field of expectedFields) {
    if (!fields.hasOwnProperty(field)) {
      const msg = `error: expected fields not present - ${field}`;
      throw new Error(msg);
    }
  }

  if (Array.isArray(files.pdfFile)) {
    const msg = 'error: array of files was not expected';
    throw new Error(msg);
  }

  const pdfFile = files.pdfFile;
  const pdfFileName = pdfFile.originalFilename;
  const uuid = fields.uuid;

  if (Array.isArray(uuid) || !pdfFile || pdfFile === null) {
    const msg = 'error: invalid form parameter';
    throw new Error(msg);
  }

  if (!pdfFileName || pdfFileName === null || pdfFileName === "") {
    const msg = "error: pdfFileName is invalid: " + pdfFileName;
    throw new Error(msg);
  }

  const copiedFilePath = `./temp/${uuid}/${pdfFileName}`;
  fs.mkdirSync(`./temp/${uuid}`);
  fs.copyFileSync(pdfFile.filepath, copiedFilePath);
  return {uuid: uuid, fileName: pdfFileName};
}

async function parseFormData(req: IncomingMessage): Promise<{ fields: Fields; files: Files }> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
}

export async function compressWithGs(req: IncomingMessage, res: ServerResponse): Promise<void> {
  console.log('CHECKS');
  if (!req.headers['content-type'] || !req.headers['content-type'].startsWith('multipart/form-data')) {
    const msg = `error: content-type is not multipart/form-data, ${req.headers['content-type']}`;
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end(msg);
    return;
  }

  console.log('PARSE');
  let copiedFilePath: PdfResultDto;;
  try {
    const fieldsAndFiles = await parseFormData(req);
    copiedFilePath = copyPpf(fieldsAndFiles.fields, fieldsAndFiles.files);
  } catch (err) {
    console.log(err);
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end(err);
    return;
  }

  await executeCommand(copiedFilePath.uuid, copiedFilePath.fileName).catch((err) => {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('error: command');
    return;
  });

  const msg = 'UPLOAD AND SAVE: SUCCESS';
  console.log(msg);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({msg: msg, compressedPdf: copiedFilePath}));
  return;
}
