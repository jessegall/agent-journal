import json
import re
import secrets
import shutil
import subprocess
import time
from pathlib import Path

from engine.stored import read_json, write_json

TUNNEL_FILE = "sharing.json"
NAME_BYTES = 12
LOCAL_BIN = Path.home() / ".local" / "bin" / "tunler"


def subdomain(root: Path) -> str:
    kept = read_json(Path(root) / TUNNEL_FILE, {}) or {}
    if kept.get("subdomain"):
        return kept["subdomain"]
    prefix = re.sub(r"[^a-z0-9]+", "-", Path(root).resolve().parent.name.lower())[:20].strip("-") or "journal"
    name = f"{prefix}-{secrets.token_hex(NAME_BYTES)}"
    write_json(Path(root) / TUNNEL_FILE, {**kept, "subdomain": name})
    return name


def tunler() -> str:
    found = shutil.which("tunler")
    if found:
        return found
    return str(LOCAL_BIN) if LOCAL_BIN.is_file() else ""

STATUS_SECONDS = 5
STATUS_KEPT = 60
KEPT_STATUS: dict = {}


def tunler_status() -> dict:
    if time.time() - KEPT_STATUS.get("at", 0) < STATUS_KEPT:
        return KEPT_STATUS["status"]
    KEPT_STATUS.update(at=time.time(), status=asked_status())
    return KEPT_STATUS["status"]


def asked_status() -> dict:
    command = tunler()
    if not command:
        return {"installed": False, "logged_in": False, "account": "", "host": ""}
    try:
        told = json.loads(subprocess.run([command, "status", "--json"], capture_output=True, text=True, timeout=STATUS_SECONDS).stdout or "{}")
    except (OSError, subprocess.TimeoutExpired, ValueError):
        told = {}
    return {"installed": True, "logged_in": bool(told.get("logged_in") and told.get("auth_ok")), "account": told.get("email", ""),
            "host": told.get("host", "")}
