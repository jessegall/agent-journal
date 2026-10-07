import json
import os
import platform
import secrets
import shutil
import ssl
import time
from pathlib import Path
from urllib.request import urlopen

from engine.proc import ran as ran_command
from engine.stored import write_json
from typing import TypedDict
from engine.given import given
from engine.state import State
from engine.wording import slugged
from resources.base import Refused

TUNNEL_FILE, BACKUP_FILE = "sharing.json", "sharing.backup.json"
ADDRESS_REFUSED, READDRESSED, SIGNED_OUT = "address_refused", "readdressed", "signed_out"
OWNED = "domain is owned by another user"
HELD = "409 Conflict"
MOVED = "the journal moved the tunnel to a new address:"
LAST_LINES = 4
NAME_BYTES = 12
LOCAL_BIN = Path.home() / ".local" / "bin" / "tunler"
ELSEWHERE_BINS = (Path("/opt/homebrew/bin/tunler"), Path("/usr/local/bin/tunler"), Path.home() / "go" / "bin" / "tunler")
DEFAULT_SERVER = "tunler.jessegall.nl"
KILLED = -9
CERTIFICATES = ("Python on this machine has no root certificates, so it cannot check the tunler server, and curl could not download tunler either. "
                "On macOS, open the Python folder under Applications and run Install Certificates.command, then try again.")
BLOCKED = "macOS stopped the downloaded tunler from running, even after signing it on this machine. The tunler already here, if any, is kept."
SERVER, TUNNEL = "sharing.server", "sharing.tunnel"
ARCHES = {"x86_64": "amd64", "amd64": "amd64", "aarch64": "arm64", "arm64": "arm64"}
DOWNLOAD_SECONDS = 60
ROUTE_LINES = ("gateway", "interface")


def system() -> str:
    return platform.system()


def machine() -> str:
    return platform.machine().lower()


def read_address(path: Path) -> dict:
    unreadable = f"cannot read the tunnel address in {path}; the address has not changed"
    try:
        kept = json.loads(path.read_text())
    except (OSError, ValueError) as error:
        raise Refused(unreadable) from error
    if not isinstance(kept, dict):
        raise Refused(unreadable)
    return kept


def kept_address(root: Path) -> dict:
    path, backup = Path(root) / TUNNEL_FILE, Path(root) / BACKUP_FILE
    if not path.exists():
        return {}
    try:
        return read_address(path)
    except Refused:
        if not backup.exists():
            raise
    kept = read_address(backup)
    keep_address(root, kept)
    return kept


def keep_address(root: Path, kept: dict) -> None:
    write_json(Path(root) / TUNNEL_FILE, kept)
    write_json(Path(root) / BACKUP_FILE, kept)


def alerts(root: Path) -> State:
    return State(Path(root) / "runtime" / "sharing-tunnel.json")


def readable_address(root: Path) -> dict:
    try:
        return kept_address(root)
    except Refused:
        return {}


def new_address(root: Path, claim: dict) -> str:
    return addressed(root, {**readable_address(root), **claim})


def addressed(root: Path, kept: dict) -> str:
    prefix = slugged(Path(root).resolve().parent.name, limit=20) or "journal"
    name = f"{prefix}-{secrets.token_hex(NAME_BYTES)}"
    keep_address(root, {**kept, "subdomain": name})
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
    asking = ["route", "-n", "get", "default"] if system() == "Darwin" else ["ip", "route", "show", "default"]
    done = ran_command(asking, timeout=3)
    if not done or done.returncode:
        return ""
    return "\n".join(line.strip() for line in done.stdout.splitlines() if line.split(":")[0].strip() in ROUTE_LINES or line.startswith("default"))


def tunler() -> str:
    found = shutil.which("tunler")
    if found:
        return found
    return next((str(path) for path in (LOCAL_BIN, *ELSEWHERE_BINS) if path.is_file()), "")

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
    command: str
    logged_in: bool
    rejected: bool
    outdated: bool
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
        return TunnelStatus(installed=False, command="", logged_in=False, rejected=False, outdated=False, account="", host="", unreadable=False)
    done = ran_command([command, "status", "--json"], timeout=STATUS_SECONDS)
    try:
        fields = json.loads(done.stdout) if done else None
    except ValueError:
        fields = None
    if not isinstance(fields, dict):
        return TunnelStatus(installed=True, command=command, logged_in=False, rejected=False, outdated=False, account="", host="", unreadable=True)
    saved = bool(fields.get("logged_in"))
    return TunnelStatus(installed=True, command=command, logged_in=saved and bool(fields.get("auth_ok")), rejected=saved and fields.get("auth_ok") is False,
                        outdated=saved and "auth_ok" not in fields, account=fields.get("user") or fields.get("email", ""), host=fields.get("host", ""),
                        unreadable=False)


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
    ok, output = ran("login", username, f"--host={host}", hidden=given(TUNLER_PASSWORD=password, TUNLER_MASTER_PASSWORD=master))
    if ok:
        return Login(connected=True, needs_master=False, error="")
    lines = output.splitlines() or ["tunler refused the login"]
    needs = "master password" in output.lower() and master is None
    return Login(connected=False, needs_master=needs, error=lines[0] if needs else lines[-1])


class TunlerVersion(TypedDict):
    current: str
    latest: str
    update_available: bool


def installed() -> str:
    ok, output = ran("version")
    return output.split()[-1] if ok and output else ""


def latest(host: str) -> str:
    try:
        with urlopen(f"https://{host}/_tunler/version", timeout=STATUS_SECONDS) as answer:
            return str(json.loads(answer.read()).get("version", ""))
    except (OSError, ValueError):
        return ""


def versions(host: str) -> TunlerVersion:
    ok, output = ran("update", "--check", "--json", f"--host={host}")
    try:
        reported = json.loads(output) if ok else {}
    except ValueError:
        reported = {}
    if "update_available" in reported:
        return TunlerVersion(current=reported.get("current", ""), latest=reported.get("latest", ""), update_available=bool(reported["update_available"]))
    current, newest = installed(), latest(host)
    return TunlerVersion(current=current, latest=newest, update_available=bool(current and newest and current != newest))


def server_name(address: str) -> str:
    server = address.strip().removeprefix("https://").removeprefix("http://").split("/")[0]
    if not server:
        raise Refused("give the address of the tunler server to install from, such as tunler.example.com")
    return server


def install(host: str) -> str:
    arch = machine()
    build = f"tunler-{system().lower()}-{ARCHES.get(arch, arch)}"
    part = LOCAL_BIN.with_name("tunler.part")
    LOCAL_BIN.parent.mkdir(parents=True, exist_ok=True)
    download(f"https://{host}/dl/{build}", part, host)
    part.chmod(0o700)
    version = verified(part)
    part.replace(LOCAL_BIN)
    KEPT_STATUS.clear()
    return f"tunler {version} is installed"


def download(url: str, part: Path, host: str) -> None:
    try:
        with urlopen(url, timeout=DOWNLOAD_SECONDS) as answer:
            part.write_bytes(answer.read())
        return
    except OSError as error:
        if not isinstance(getattr(error, "reason", error), ssl.SSLCertVerificationError):
            part.unlink(missing_ok=True)
            raise Refused(f"tunler could not be downloaded from {host}: {error}") from error
    curl = shutil.which("curl")
    done = ran_command([curl, "-fsSL", "-o", str(part), url], timeout=DOWNLOAD_SECONDS) if curl else None
    if not done or done.returncode:
        part.unlink(missing_ok=True)
        raise Refused(CERTIFICATES)


def verified(binary: Path) -> str:
    done = ran_command([str(binary), "version"], timeout=STATUS_SECONDS)
    if done and done.returncode == KILLED and system() == "Darwin":
        ran_command(["codesign", "--force", "--sign", "-", str(binary)], timeout=STATUS_SECONDS)
        done = ran_command([str(binary), "version"], timeout=STATUS_SECONDS)
    if done and done.returncode == 0 and done.stdout.startswith("tunler "):
        return done.stdout.split()[-1]
    binary.unlink(missing_ok=True)
    if done and done.returncode == KILLED:
        raise Refused(BLOCKED)
    raise Refused("what the server sent is not a working tunler, so nothing was replaced: the tunler already here, if any, is kept")


def updated() -> str:
    ok, output = ran("update")
    if not ok:
        return output or "tunler did not update"
    return output.splitlines()[-1] if output else "tunler is up to date"


def log_out() -> str:
    ok, output = ran("logout")
    return "" if ok else output or "tunler did not log out"


def owned() -> list[str]:
    ok, output = ran("domains")
    return [line.strip() for line in output.splitlines() if line.strip()] if ok else []


def unclaim(domain: str, host: str) -> str:
    ok, output = ran("release", domain.removesuffix(f".{host}"))
    return "" if ok else output or f"tunler did not release {domain}"
