from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import mimetypes


ROOT = Path(__file__).resolve().parent
INDEX = ROOT / "index.html"


class SpaHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        clean = path.split("?", 1)[0].split("#", 1)[0].lstrip("/")
        return str((ROOT / clean).resolve())

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        clean = self.path.split("?", 1)[0].split("#", 1)[0]
        target = (ROOT / clean.lstrip("/")).resolve()
        if clean in ("", "/"):
            return self._serve_file(INDEX)
        if target.is_file() and str(target).startswith(str(ROOT)):
            return self._serve_file(target)
        return self._serve_file(INDEX)

    def _serve_file(self, path):
        try:
            data = path.read_bytes()
        except FileNotFoundError:
            self.send_error(404)
            return
        content_type = mimetypes.guess_type(str(path))[0] or "application/octet-stream"
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 4173), SpaHandler)
    print("Serving on http://127.0.0.1:4173")
    server.serve_forever()
