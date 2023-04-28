
function sayHello(res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({ message: 'Hello, world!' }));
  res.end();
}

module.exports = sayHello;

