"""Serve the fictional, read-only checkout and product website on loopback only."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
import argparse

ROOT = Path(__file__).resolve().parent
DEMO_HOSTS = {"paydesk.localhost", "billing.pearl.localhost", "processor.pearl.localhost", "shop.localhost"}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, request, client_address, server):
        super().__init__(request, client_address, server, directory=str(ROOT.parent / "website"))

    def do_GET(self):
        host = self.headers.get("Host", "").split(":")[0].lower()
        if host in DEMO_HOSTS:
            self.directory = str(ROOT)
            path = urlsplit(self.path).path
            if path in {"/", "/neutral"}:
                self.path = "/index.html"
            elif path not in {"/demo.js", "/demo.css"}:
                self.send_error(404)
                return
        elif host not in {"localhost", "127.0.0.1"}:
            self.send_error(400, "Unsupported host")
            return
        super().do_GET()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=4176)
    port = parser.parse_args().port
    print(f"Website: http://localhost:{port}/", flush=True)
    with ThreadingHTTPServer(("127.0.0.1", port), Handler) as server:
        server.serve_forever()
