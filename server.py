#!/usr/bin/env python3
"""Dîvân-ı Kare — basit statik sunucu (localhost)."""

import http.server
import os
import socketserver

PORT = int(os.environ.get("PORT", "8000"))
DIR = os.path.dirname(os.path.abspath(__file__))

EXTENSIONS = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon",
    ".json": "application/json",
}


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def guess_type(self, path):
        ext = os.path.splitext(path)[1].lower()
        return EXTENSIONS.get(ext, "application/octet-stream")

    def log_message(self, fmt, *args):
        print(f"[{self.log_date_time_string()}] {self.address_string()} {fmt % args}")


class ThreadingServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == "__main__":
    os.chdir(DIR)
    with ThreadingServer(("127.0.0.1", PORT), Handler) as httpd:
        print(f"Dîvân-ı Kare → http://localhost:{PORT}")
        print("Durdurmak için Ctrl+C")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nKapatılıyor.")
