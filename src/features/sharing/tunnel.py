import json
import os
import platform
import secrets
import shutil
import time
import urllib.request
from pathlib import Path

from engine.proc import ran as ran_command
from engine.stored import write_json
from typing import TypedDict
from engine.given import given
from engine.state import State
from engine.wording import slugged
from resources.base import Refused

TUNNEL_FILE = "sharing.json"
ADDRESS_REFUSED = "address_refused"
OWNED = "domain is owned by another user"
HELD = "409 Conflict"
MOVED = "the journal moved the tunnel to a new address:"
LAST_LINES = 4
NAME_BYTES = 12
LOCAL_BIN = Path.home() / ".local" / "bin" / "tunler"
SERVER, TUNNEL = "sharing.server", "sharing.tunnel"
ARCHES = {"x86_64": "amd64", "aarch64": "arm64"}
DOWNLOAD_SECONDS = 60
ROUTE_LINES = ("gateway", "interface")


def kept_address(root: Path) -> dict:
    path = Path(root) / TUNNEL_FILE
    if not path.exists():
        return {}
    unreadable = f"cannot read the tunnel address in {path}; the address has not changed"
    try:
        kept = json.loads(path.read_text())
    except (OSError, ValueError) as error:
        raise Refused(unreadable) from error
    if not isinstance(kept, dict):
        raise Refused(unreadable)
    return kept


def alerts(root: Path) -> State:
    return State(Path(root) / "runtime" / "sharing-tunnel.json")


def subdomain(root: Path) -> str:
    kept = kept_address(root)
    return kept.get("subdomain") or addressed(root, kept)


def readable_address(root: Path) -> dict:
    try:
        return kept_address(root)
    except Refused:
        return {}


def new_address(root: Path) -> str:
    return addressed(root, {key: value for key, value in readable_address(root).items() if key != "subdomain"})


def addressed(root: Path, kept: dict) -> str:
    prefix = slugged(Path(root).resolve().parent.name, limit=20) or "journal"
    name = f"{prefix}-{secrets.token_hex(NAME_BYTES)}"
    write_json(Path(root) / TUNNEL_FILE, {**kept, "subdomain": name})
    return name


def last_lines(log: Path) -> list[str]:
    try:
        return log.read_text(errors="ignore").split(MOVED)[-1].splitlines()[-LAST_LINES:]
    except OSError:
        return []


def refused_address(log: Path) -> bool:
    return any(OWNED in line for line in last_lines(log))


def moved(log: Path, name: str) -> None:
    log.parent.mkdir(parents=True, exist_ok=True)
    with log.open("a") as written:
        written.write(f"{MOVED} {name}\n")


def held_by_server(log: Path) -> bool:
    lines = last_lines(log)
    return bool(lines) and HELD in lines[-1]


def tunler_build(command: str) -> str:
    made = Path(command).stat()
    return f"{command}:{made.st_size}:{made.st_mtime_ns}"


def default_route() -> str:
    asking = ["route", "-n", "get", "default"] if platform.system() == "Darwin" else ["ip", "route", "show", "default"]
    done = ran_command(asking, timeout=3)
    if not done or done.returncode:
        return ""
    return "\n".join(line.strip() for line in done.stdout.splitlines() if line.split(":")[0].strip() in ROUTE_LINES or line.startswith("default"))


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
    asked = asked_status()
    if asked["unreadable"]:
        return asked
    KEPT_STATUS.update(at=time.time(), status=asked)
    return asked


class TunnelStatus(TypedDict):
    installed: bool
    logged_in: bool
    account: str
    host: str
    unreadable: bool


class Login(TypedDict):
    connected: bool
    needs_master: bool
    error: str


def asked_status() -> TunnelStatus:
    command = tunler()
    if not command:
        return TunnelStatus(installed=False, logged_in=False, account="", host="", unreadable=False)
    done = ran_command([command, "status", "--json"], timeout=STATUS_SECONDS)
    try:
        fields = json.loads(done.stdout) if done else None
    except ValueError:
        fields = None
    if not isinstance(fields, dict):
        return TunnelStatus(installed=True, logged_in=False, account="", host="", unreadable=True)
    return TunnelStatus(installed=True, logged_in=bool(fields.get("logged_in") and fields.get("auth_ok")), account=fields.get("user") or fields.get("email", ""),
                        host=fields.get("host", ""), unreadable=False)


LOGIN_SECONDS = 30


def ran(*words: str, hidden: dict | None = None) -> tuple[bool, str]:
    command = tunler()
    if not command:
        return False, "tunler isn't installed on this machine"
    done = ran_command([command, *words], timeout=LOGIN_SECONDS, stdin="", env={**os.environ, **(hidden or {})})
    if done is None:
        return False, f"tunler {words[0]} did not finish"
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


def server_name(address: str) -> str:
    server = address.strip().removeprefix("https://").removeprefix("http://").split("/")[0]
    if not server:
        raise Refused("give the address of the tunler server to install from, such as tunler.example.com")
    return server


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
        raise Refused(f"tunler could not be downloaded from {host}: {error}") from error
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
