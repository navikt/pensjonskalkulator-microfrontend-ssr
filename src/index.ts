import { createAppServer } from "./server.js";

const portValue = process.env.PORT;
const port = portValue === undefined ? 3000 : Number(portValue);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT: ${portValue}`);
}

const host = process.env.HOST ?? "0.0.0.0";
const server = createAppServer();
server.on("error", (error) => {
  console.error("HTTP server failed", error);
  process.exit(1);
});
server.listen(port, host, () => {
  console.info(`SSR server listening on http://${host}:${port}`);
});

for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.once(signal, () => {
    console.info(`Received ${signal}, closing HTTP server`);
    server.close((error) => {
      if (error) {
        console.error("Failed to close HTTP server", error);
        process.exitCode = 1;
      }
    });
  });
}
