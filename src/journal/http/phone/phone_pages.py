import json

from journal.config import Config
from journal.http.controllers.journal import COLOR
from journal.http.phone.phone_icon import PhoneIcon
from journal.http.sharing.share_pages import APP, APP_HEADERS, SharePages
from journal.http.support.share_answer import ShareAnswer

PAGE = "phone.html"
WORKER = "phone-sw.js"
ICONS = {"icon-180.png": 180, "icon-192.png": 192, "icon-512.png": 512}
PAGE_HEADERS = {"Content-Security-Policy": APP_HEADERS["Content-Security-Policy"] + "; manifest-src 'self'; worker-src 'self'"}
BACKGROUND = "#131416"


class PhonePages:
    """What the tunnel's listener answers under /p/, as version 3 did: the phone page, its files, its service worker, its manifest and its icons, so the page installs on a phone as an app."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def get(self, path: str) -> ShareAnswer:
        address = path.split("?", 1)[0]
        rest = [part for part in address.split("/")[2:] if part]
        if not rest:
            return self.page(address)
        if rest[0] == "assets" and len(rest) == 2:
            return SharePages.asset(rest[1])
        if rest == ["sw.js"]:
            return self.worker()
        if rest == ["manifest.webmanifest"]:
            return self.manifest()
        if len(rest) == 1 and rest[0] in ICONS:
            return ShareAnswer(200, PhoneIcon(COLOR).png(ICONS[rest[0]]), "image/png", {"Cache-Control": "public, max-age=86400"})
        return SharePages.gone(404)

    @staticmethod
    def page(address: str) -> ShareAnswer:
        """The phone app; its address ends in a slash, so its files are found beside it."""
        if not address.endswith("/"):
            return ShareAnswer(301, headers={"Location": "/p/"})
        page = APP / PAGE
        if not page.is_file():
            return SharePages.gone(404)
        return ShareAnswer(200, page.read_bytes(), headers=PAGE_HEADERS)

    @staticmethod
    def worker() -> ShareAnswer:
        """The service worker, allowed to serve all of /p/ though it is fetched from inside it, and never kept stale."""
        found = APP / WORKER
        if not found.is_file():
            return SharePages.gone(404)
        return ShareAnswer(200, found.read_bytes(), "text/javascript", {"Service-Worker-Allowed": "/p/", "Cache-Control": "no-cache", **APP_HEADERS})

    def manifest(self) -> ShareAnswer:
        project = self.config.root.name
        body = {"name": f"{project} journal", "short_name": project, "start_url": "/p/", "scope": "/p/", "display": "standalone",
                "background_color": BACKGROUND, "theme_color": COLOR,
                "icons": [{"src": f"/p/{name}", "sizes": f"{side}x{side}", "type": "image/png"} for name, side in ICONS.items()]}
        return ShareAnswer(200, json.dumps(body).encode(), "application/manifest+json", {"Cache-Control": "no-store"})
