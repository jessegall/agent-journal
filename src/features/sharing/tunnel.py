import json
import os
import re
import secrets
import shutil
import subprocess
import time
from pathlib import Path

from engine.stored import read_json, write_json
from typing import TypedDict
from engine.given import given

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


class TunnelStatus(TypedDict):
    installed: bool
    logged_in: bool
    account: str
    host: str


class Login(TypedDict):
    connected: bool
    needs_master: bool
    error: str


def asked_status() -> TunnelStatus:
    command = tunler()
    if not command:
        return TunnelStatus(installed=False, logged_in=False, account="", host="")
    try:
        told = json.loads(subprocess.run([command, "status", "--json"], capture_output=True, text=True, timeout=STATUS_SECONDS).stdout or "{}")
    except (OSError, subprocess.TimeoutExpired, ValueError):
        told = {}
    return TunnelStatus(installed=True, logged_in=bool(told.get("logged_in") and told.get("auth_ok")), account=told.get("user") or told.get("email", ""),
                        host=told.get("host", ""))


LOGIN_SECONDS = 30


def ran(*words: str, hidden: dict | None = None) -> tuple[bool, str]:
    command = tunler()
    if not command:
        return False, "tunler isn't installed on this machine"
    try:
        done = subprocess.run([command, *words], capture_output=True, text=True, timeout=LOGIN_SECONDS, env={**os.environ, **(hidden or {})},
                              stdin=subprocess.DEVNULL)
    except (OSError, subprocess.TimeoutExpired) as error:
        return False, f"tunler {words[0]} did not finish: {error}"
    KEPT_STATUS.clear()
    return done.returncode == 0, (done.stdout if done.returncode == 0 else done.stderr or done.stdout).strip()


def log_in(host: str, username: str, password: str, master: str | None = None) -> Login:
    ok, said = ran("login", username, f"--host={host}", hidden=given(TUNLER_PASSWORD=password, TUNLER_MASTER_PASSWORD=master))
    if ok:
        return Login(connected=True, needs_master=False, error="")
    lines = said.splitlines() or ["tunler refused the login"]
    needs = "master password" in said.lower() and master is None
    return Login(connected=False, needs_master=needs, error=lines[0] if needs else lines[-1])


def installed() -> str:
    ok, said = ran("version")
    return said.split()[-1] if ok and said else ""


def updated() -> str:
    ok, said = ran("update")
    if not ok:
        return said or "tunler did not update"
    return said.splitlines()[-1] if said else "tunler is up to date"


def log_out() -> str:
    ok, said = ran("logout")
    return "" if ok else said or "tunler did not log out"


def owned() -> list[str]:
    ok, said = ran("domains")
    return [line.strip() for line in said.splitlines() if line.strip()] if ok else []


def unclaim(domain: str, host: str) -> str:
    ok, said = ran("release", domain.removesuffix(f".{host}"))
    return "" if ok else said or f"tunler did not release {domain}"

