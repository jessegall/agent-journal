import json
import os
import platform
import secrets
import shutil
import subprocess
import time
import urllib.request
from pathlib import Path

from engine.stored import read_json, write_json
from typing import TypedDict
from engine.given import given
from engine.wording import slugged
from resources.base import Refused

TUNNEL_FILE = "sharing.json"
OWNED = "domain is owned by another user"
NAME_BYTES = 12
LOCAL_BIN = Path.home() / ".local" / "bin" / "tunler"
ARCHES = {"x86_64": "amd64", "aarch64": "arm64"}
DOWNLOAD_SECONDS = 60


def subdomain(root: Path) -> str:
    path = Path(root) / TUNNEL_FILE
    kept = {}
    if path.exists():
        unreadable = f"cannot read the tunnel address in {path}; the address has not changed"
        try:
            kept = json.loads(path.read_text())
        except (OSError, ValueError) as error:
            raise Refused(unreadable) from error
        if not isinstance(kept, dict):
            raise Refused(unreadable)
    if kept.get("subdomain"):
        return kept["subdomain"]
    return addressed(root, kept)


def addressed(root: Path, kept: dict) -> str:
    prefix = slugged(Path(root).resolve().parent.name, limit=20) or "journal"
    name = f"{prefix}-{secrets.token_hex(NAME_BYTES)}"
    write_json(Path(root) / TUNNEL_FILE, {**kept, "subdomain": name})
    return name


def refused_address(log: Path) -> bool:
    try:
        lines = log.read_text(errors="ignore").splitlines()[-4:]
    except OSError:
        return False
    return any(OWNED in line for line in lines)


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


class TunlerVersion(TypedDict):
    current: str
    latest: str
    update_available: bool


def installed() -> str:
    ok, said = ran("version")
    return said.split()[-1] if ok and said else ""


def latest(host: str) -> str:
    try:
        with urllib.request.urlopen(f"https://{host}/_tunler/version", timeout=STATUS_SECONDS) as answer:
            return str(json.loads(answer.read()).get("version", ""))
    except (OSError, ValueError):
        return ""


def versions(host: str) -> TunlerVersion:
    ok, said = ran("update", "--check", "--json", f"--host={host}")
    try:
        told = json.loads(said) if ok else {}
    except ValueError:
        told = {}
    if "update_available" in told:
        return TunlerVersion(current=told.get("current", ""), latest=told.get("latest", ""), update_available=bool(told["update_available"]))
    current, newest = installed(), latest(host)
    return TunlerVersion(current=current, latest=newest, update_available=bool(current and newest and current != newest))


def install(host: str) -> str:
    machine = platform.machine().lower()
    build = f"tunler-{platform.system().lower()}-{ARCHES.get(machine, machine)}"
    part = LOCAL_BIN.with_name("tunler.part")
    LOCAL_BIN.parent.mkdir(parents=True, exist_ok=True)
    try:
        with urllib.request.urlopen(f"https://{host}/dl/{build}", timeout=DOWNLOAD_SECONDS) as answer:
            part.write_bytes(answer.read())
    except OSError as error:
        part.unlink(missing_ok=True)
        return f"tunler could not be downloaded: {error}"
    part.chmod(0o700)
    part.replace(LOCAL_BIN)
    return f"tunler {installed()} is installed"


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
