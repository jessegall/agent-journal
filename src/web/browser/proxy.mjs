import http from "node:http";

const PORT_WAIT = 5000;

export async function throughProxy(target) {
    const aim = new URL(target);
    const sockets = new Set();
    const make = () => {
        const server = http.createServer((request, response) => {
            const forwarded = http.request({host: aim.hostname, port: aim.port, path: request.url, method: request.method, headers: {...request.headers, host: aim.host, ...(request.headers.origin ? {origin: aim.origin} : {})}}, (answer) => {
                response.writeHead(answer.statusCode, answer.headers);
                answer.pipe(response);
            });
            forwarded.on("error", () => response.destroy());
            response.on("close", () => forwarded.destroy());
            request.pipe(forwarded);
        });
        server.on("connection", (socket) => {
            sockets.add(socket);
            socket.on("close", () => sockets.delete(socket));
        });
        return server;
    };
    let server = make();
    await new Promise((done) => server.listen(0, "127.0.0.1", done));
    const port = server.address().port;
    return {
        url: `http://127.0.0.1:${port}/`,
        away() {
            sockets.forEach((socket) => socket.destroy());
            return new Promise((done) => server.close(done));
        },
        back() {
            server = make();
            return new Promise((done, fail) => {
                const timer = setTimeout(() => fail(new Error("the proxy port did not come back")), PORT_WAIT);
                server.once("error", fail);
                server.listen(port, "127.0.0.1", () => (clearTimeout(timer), done()));
            });
        },
        stop() {
            sockets.forEach((socket) => socket.destroy());
            return new Promise((done) => server.close(done));
        },
    };
}
