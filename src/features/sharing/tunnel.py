import secrets
import shutil
from pathlib import Path

from engine.stored import read_json, write_json

TUNNEL_FILE = "sharing.json"
NAME_BYTES = 12
LOCAL_BIN = Path.home() / ".local" / "bin" / "tunler"


def subdomain(root: Path) -> str:
    kept = read_json(Path(root) / TUNNEL_FILE, {}) or {}
    if kept.get("subdomain"):
        return kept["subdomain"]
    name = f"{Path(root).resolve().parent.name.lower()[:20].strip('-')}-{secrets.token_hex(NAME_BYTES)}"
    name = "".join(c if c.isalnum() or c == "-" else "-" for c in name)
    write_json(Path(root) / TUNNEL_FILE, {**kept, "subdomain": name})
    return name


def tunler() -> str:
    found = shutil.which("tunler")
    if found:
        return found
    return str(LOCAL_BIN) if LOCAL_BIN.is_file() else ""
