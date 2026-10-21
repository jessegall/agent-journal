import json
import os
import re
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

from journal.support.rejection import Rejection
from journal.support.secret_values import SecretValues

PLAYWRIGHT = "playwright@1.63.0"
OPEN_BROWSER = ("npx", "-y", PLAYWRIGHT, "open")
INSTALL_BROWSER = ("npx", "-y", PLAYWRIGHT, "install", "chromium")
WINDOW = 900


class BrowserLogins:
    """Browser logins kept beside the secrets' values: each captured once in a Playwright window the user logs in to and closes, saved under the secret's name, and merged into the one storage file the agent's browser starts with."""

    def __init__(self, values: SecretValues) -> None:
        self.values = values

    @property
    def folder(self) -> Path:
        return self.values.path.with_suffix(".sessions")

    @property
    def merged(self) -> Path:
        return self.values.path.with_suffix(".browser.json")

    def stored_login(self, title: str) -> Path:
        return self.folder / f"{re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-') or 'login'}.json"

    def record(self, title: str, url: str) -> Path:
        if shutil.which(OPEN_BROWSER[0]) is None:
            raise Rejection("logging in needs npx, which comes with Node.js, on this machine")
        self.folder.mkdir(mode=0o700, parents=True, exist_ok=True)
        saved = self.stored_login(title)
        subprocess.run(INSTALL_BROWSER, check=False, capture_output=True, timeout=WINDOW)
        opened = subprocess.run([*OPEN_BROWSER, f"--save-storage={saved}", url], check=False, capture_output=True, text=True, timeout=WINDOW)
        if not saved.is_file():
            errors = [line.strip() for line in opened.stderr.splitlines() if line.strip()]
            raise Rejection(f"no login was saved: {errors[0] if errors else 'log in in the browser that opens, then close its window'}")
        saved.chmod(0o600)
        return saved

    def drop(self, title: str) -> None:
        self.stored_login(title).unlink(missing_ok=True)

    def merge(self) -> Path | None:
        saved = sorted(self.folder.glob("*.json")) if self.folder.is_dir() else []
        if not saved:
            self.merged.unlink(missing_ok=True)
            return None
        cookies, origins = {}, {}
        for path in saved:
            state = json.loads(path.read_text())
            cookies.update({(c["name"], c["domain"], c["path"]): c for c in state.get("cookies", [])})
            origins.update({o["origin"]: o for o in state.get("origins", [])})
        handle = os.open(self.merged, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
        with os.fdopen(handle, "w") as output:
            json.dump({"cookies": list(cookies.values()), "origins": list(origins.values())}, output)
        return self.merged

    def expires(self, saved: Path, url: str) -> datetime | None:
        host = urlparse(url).hostname or ""
        ends = [c["expires"] for c in json.loads(saved.read_text()).get("cookies", []) if c.get("expires", -1) > 0 and host.endswith(c.get("domain", "").lstrip("."))]
        return datetime.fromtimestamp(min(ends), timezone.utc) if ends else None
