import {chromium} from "playwright-core";

const server = await chromium.launchServer();
console.log(server.wsEndpoint());
const close = () => server.close().then(() => process.exit(0));
process.stdin.on("end", close).resume();
process.on("SIGTERM", close);
