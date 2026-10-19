import json
import os
import re
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

from journal.support.refused import Refused
from journal.support.secret_values import SecretValues

PLAYWRIGHT = "playwright@1.63.0"
OPEN_BROWSER = ("npx", "-y", PLAYWRIGHT, "open")
INSTALL_BROWSER = ("npx", "-y", PLAYWRIGHT, "install", "chromium")
WINDOW = 900
"""The longest a login window stays open: fifteen minutes to log in and close it."""


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

    def saved_for(self, title: str) -> Path:
        return self.folder / f"{re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-') or 'login'}.json"

    def record(self, title: str, url: str) -> Path:
        """The browser opened on the site; what the user's login left behind is saved when they close it. Refused when npx is missing or nothing was saved."""
        if shutil.which(OPEN_BROWSER[0]) is None:
            raise Refused("logging in needs npx, which comes with Node.js, on this machine")
        self.folder.mkdir(mode=0o700, parents=True, exist_ok=True)
        saved = self.saved_for(title)
        subprocess.run(INSTALL_BROWSER, check=False, capture_output=True, timeout=WINDOW)
        opened = subprocess.run([*OPEN_BROWSER, f"--save-storage={saved}", url], check=False, capture_output=True, text=True, timeout=WINDOW)
        if not saved.is_file():
            errors = [line.strip() for line in opened.stderr.splitlines() if line.strip()]
            raise Refused(f"no login was saved: {errors[0] if errors else 'log in in the browser that opens, then close its window'}")
        saved.chmod(0o600)
        return saved

    def forget(self, title: str) -> None:
        self.saved_for(title).unlink(missing_ok=True)

    def merge(self) -> Path | None:
        """Every saved login in one storage file, 0600; none when no login is saved."""
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
        with os.fdopen(handle, "w") as out:
            json.dump({"cookies": list(cookies.values()), "origins": list(origins.values())}, out)
        return self.merged

    def expires(self, saved: Path, url: str) -> datetime | None:
        """When the login runs out: the earliest expiry among the site's own cookies, not a passing cookie of another domain."""
        host = urlparse(url).hostname or ""
        ends = [c["expires"] for c in json.loads(saved.read_text()).get("cookies", []) if c.get("expires", -1) > 0 and host.endswith(c.get("domain", "").lstrip("."))]
        return datetime.fromtimestamp(min(ends), timezone.utc) if ends else None
