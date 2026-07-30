import { createServer } from "node:http";
import { route } from "./router.js";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";

export function createApp() {
  return createServer((request, response) => {
    const { pathname } = new URL(request.url, `http://${request.headers.host}`);
    const { status, body } = route(pathname);
    response.writeHead(status, { "Content-Type": "application/json" });
    response.end(JSON.stringify(body));
  });
}

createApp().listen(PORT, HOST, () => {
  console.log(`redux_gui_test listening on http://${HOST}:${PORT}`);
});
