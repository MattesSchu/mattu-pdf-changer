import { ServerResponse } from 'http';

export function sayHello(res: ServerResponse) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({ message: 'Hello, world!' }));
  res.end();
  return;
}
