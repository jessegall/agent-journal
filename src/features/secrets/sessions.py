import json
import os
import shutil
import subprocess
from pathlib import Path

from engine.wording import slugged
from features.secrets.values import project_id, secrets_folder
from resources.base import Refused

OPEN_BROWSER = ("npx", "-y", "playwright@latest", "open")
INSTALL_BROWSER = ("npx", "-y", "playwright@latest", "install", "chromium")
UNSAVED = "log in in the browser that opens, then close its window"


class BrowserLogins:
    def __init__(self, root: Path):
        self.folder = secrets_folder() / f"{project_id(root)}.sessions"
        self.merged = secrets_folder() / f"{project_id(root)}.browser.json"

    def saved_for(self, title: str) -> Path:
        return self.folder / f"{slugged(title)}.json"

    def record(self, title: str, url: str) -> Path:
        if shutil.which(OPEN_BROWSER[0]) is None:
            raise Refused("logging in needs npx (Node.js) on this machine")
        self.folder.mkdir(mode=0o700, parents=True, exist_ok=True)
        saved = self.saved_for(title)
        subprocess.run(INSTALL_BROWSER, check=False, capture_output=True)
        opened = subprocess.run([*OPEN_BROWSER, f"--save-storage={saved}", url], check=False, capture_output=True, text=True)
        if not saved.is_file():
            said = [line for line in opened.stderr.splitlines() if line.strip()]
            raise Refused(f"no login was saved: {said[0].strip() if said else UNSAVED}")
        saved.chmod(0o600)
        return saved

    def merge(self) -> Path:
        cookies, origins = {}, {}
        for saved in sorted(self.folder.glob("*.json")):
            state = json.loads(saved.read_text())
            cookies.update({(c["name"], c["domain"], c["path"]): c for c in state.get("cookies", [])})
            origins.update({o["origin"]: o for o in state.get("origins", [])})
        handle = os.open(self.merged, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
        with os.fdopen(handle, "w") as out:
            json.dump({"cookies": list(cookies.values()), "origins": list(origins.values())}, out)
        return self.merged

    def expires(self, saved: Path) -> float:
        ends = [c["expires"] for c in json.loads(saved.read_text()).get("cookies", []) if c.get("expires", -1) > 0]
        return min(ends, default=0.0)
