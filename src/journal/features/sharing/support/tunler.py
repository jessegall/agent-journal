import json
import os
import platform
import shutil
import ssl
import signal
import subprocess
from pathlib import Path
from urllib.request import urlopen

from journal.support.cached_answer import CachedAnswer
from journal.features.sharing.support.tunler_login import TunlerLogin
from journal.features.sharing.support.tunler_status import TunlerStatus
from journal.features.sharing.support.tunler_version import TunlerVersion
from journal.support.rejection import Rejection

TUNLER_PATHS = (Path("/opt/homebrew/bin/tunler"), Path("/usr/local/bin/tunler"))
STATUS_SECONDS = 5
STATUS_CACHE_SECONDS = 60
LIST_CACHE_SECONDS = 3600
COMMAND_SECONDS = 30
DOWNLOAD_SECONDS = 60
KILLED = -9
ARCHES = {"x86_64": "amd64", "amd64": "amd64", "aarch64": "arm64", "arm64": "arm64"}
CERTIFICATES = ("Python on this machine has no root certificates, so it cannot check the tunler server, and curl could not download tunler either. "
                "On macOS, open the Python folder under Applications and run Install Certificates.command, then try again.")
BLOCKED = "macOS stopped the downloaded tunler from running, even after signing it on this machine. The tunler already here, if any, is kept."
BROKEN_TUNLER = "what the server sent is not a working tunler, so nothing was replaced: the tunler already here, if any, is kept"


class Tunler:
    """The tunler program on this machine, which gives the journal its web address: its status, its version and the domains its account holds, each asked at most once a minute, and its login."""

    def __init__(self) -> None:
        self._status = CachedAnswer(lambda: self.query(), STATUS_CACHE_SECONDS, TunlerStatus(installed=False))
        self._domains: CachedAnswer[list[str]] = CachedAnswer(lambda: self.domain_list(), LIST_CACHE_SECONDS, [])
        self._versions: dict[str, CachedAnswer[TunlerVersion]] = {}

    def command(self) -> str:
        return shutil.which("tunler") or next((str(path) for path in (self.local(), Path.home() / "go" / "bin" / "tunler", *TUNLER_PATHS) if path.is_file()), "")

    @staticmethod
    def local() -> Path:
        return Path.home() / ".local" / "bin" / "tunler"

    @staticmethod
    def running_subdomain(subdomain: str) -> list[int]:
        listed = subprocess.run(["ps", "-axo", "pid=,command="], capture_output=True, text=True, timeout=10)
        pids = []
        for line in listed.stdout.splitlines():
            pid, _, command = line.strip().partition(" ")
            terms = command.split()
            if any(word.rsplit("/", 1)[-1] == "tunler" for word in terms[:2]) and f"--domain={subdomain}" in terms:
                pids.append(int(pid))
        return pids

    def stop_subdomain(self, subdomain: str) -> list[int]:
        pids = self.running_subdomain(subdomain)
        for pid in pids:
            try:
                os.kill(pid, signal.SIGTERM)
            except ProcessLookupError:
                continue
        return pids

    def status(self) -> TunlerStatus:
        return self._status.supplied()

    def drop(self) -> None:
        self._status.is_recent()
        self._domains.drop()
        self._versions.clear()

    def query(self) -> TunlerStatus:
        command = self.command()
        if not command:
            return TunlerStatus(installed=False)
        finished = self.run_result([command, "status", "--json"], STATUS_SECONDS)
        try:
            fields = json.loads(finished.stdout) if finished else None
        except ValueError:
            fields = None
        if not isinstance(fields, dict):
            return TunlerStatus(installed=True, command=command, unreadable=True)
        saved = bool(fields.get("logged_in"))
        return TunlerStatus(installed=True, command=command, logged_in=saved and bool(fields.get("auth_ok")), rejected=saved and fields.get("auth_ok") is False,
                            outdated=saved and "auth_ok" not in fields, account=fields.get("user") or fields.get("email", ""), host=fields.get("host", ""))

    def login(self, host: str, username: str, password: str, master: str) -> TunlerLogin:
        hidden = {"TUNLER_PASSWORD": password}
        if master:
            hidden["TUNLER_MASTER_PASSWORD"] = master
        success, output = self.reported("login", username, f"--host={host}", hidden=hidden)
        self.drop()
        if success:
            return TunlerLogin(connected=True)
        lines = output.splitlines() or ["tunler refused the login"]
        needs = "master password" in output.lower() and not master
        return TunlerLogin(connected=False, needs_master=needs, error=lines[0] if needs else lines[-1])

    def logout(self) -> None:
        success, output = self.reported("logout")
        self.drop()
        if not success:
            raise Rejection(output or "tunler did not log out")

    def versions(self, host: str) -> TunlerVersion:
        return self._versions.setdefault(host, CachedAnswer(lambda: self.version_list(host), LIST_CACHE_SECONDS, TunlerVersion("", "", False))).supplied()

    def version_list(self, host: str) -> TunlerVersion:
        success, output = self.reported("update", "--check", "--json", f"--host={host}")
        try:
            reported = json.loads(output) if success else {}
        except ValueError:
            reported = {}
        if "update_available" in reported:
            return TunlerVersion(reported.get("current", ""), reported.get("latest", ""), bool(reported["update_available"]))
        current, newest = self.installed_version(), self.latest(host)
        return TunlerVersion(current, newest, bool(current and newest and current != newest))

    def installed_version(self) -> str:
        success, output = self.reported("version")
        return output.split()[-1] if success and output else ""

    @staticmethod
    def latest(host: str) -> str:
        try:
            with urlopen(f"https://{host}/_tunler/version", timeout=STATUS_SECONDS) as answer:
                return str(json.loads(answer.read()).get("version", ""))
        except (OSError, ValueError):
            return ""

    def update(self) -> str:
        success, output = self.reported("update")
        self.drop()
        if not success:
            raise Rejection(output or "tunler did not update")
        return output.splitlines()[-1] if output else "tunler is up to date"

    def domains(self) -> list[str]:
        return self._domains.supplied()

    def domain_list(self) -> list[str]:
        success, output = self.reported("domains")
        return [line.strip() for line in output.splitlines() if line.strip()] if success else []

    def release(self, domain: str, host: str) -> str:
        success, output = self.reported("release", domain.removesuffix(f".{host}"))
        self.drop()
        return "" if success else output or f"tunler did not release {domain}"

    def install(self, host: str) -> str:
        arch = platform.machine().lower()
        part = self.local().with_name("tunler.part")
        part.parent.mkdir(parents=True, exist_ok=True)
        self.download(f"https://{host}/dl/tunler-{platform.system().lower()}-{ARCHES.get(arch, arch)}", part, host)
        part.chmod(0o700)
        version = self.verified(part)
        part.replace(self.local())
        self.drop()
        return f"tunler {version} is installed"

    def download(self, url: str, part: Path, host: str) -> None:
        try:
            with urlopen(url, timeout=DOWNLOAD_SECONDS) as answer:
                part.write_bytes(answer.read())
            return
        except OSError as error:
            if not isinstance(getattr(error, "reason", error), ssl.SSLCertVerificationError):
                part.unlink(missing_ok=True)
                raise Rejection(f"tunler could not be downloaded from {host}: {error}") from error
        curl = shutil.which("curl")
        finished = self.run_result([curl, "-fsSL", "-o", str(part), url], DOWNLOAD_SECONDS) if curl else None
        if not finished or finished.returncode:
            part.unlink(missing_ok=True)
            raise Rejection(CERTIFICATES)

    def verified(self, binary: Path) -> str:
        finished = self.run_result([str(binary), "version"], STATUS_SECONDS)
        if finished and finished.returncode == KILLED and platform.system() == "Darwin":
            self.run_result(["codesign", "--force", "--sign", "-", str(binary)], STATUS_SECONDS)
            finished = self.run_result([str(binary), "version"], STATUS_SECONDS)
        if finished and finished.returncode == 0 and finished.stdout.startswith("tunler "):
            return finished.stdout.split()[-1]
        binary.unlink(missing_ok=True)
        raise Rejection(BLOCKED if finished and finished.returncode == KILLED else BROKEN_TUNLER)

    def reported(self, *text: str, hidden: dict | None = None) -> tuple[bool, str]:
        command = self.command()
        if not command:
            return False, "tunler isn't installed on this machine"
        finished = self.run_result([command, *text], COMMAND_SECONDS, hidden)
        if finished is None:
            return False, f"tunler {text[0]} did not finish"
        return finished.returncode == 0, (finished.stdout if finished.returncode == 0 else finished.stderr or finished.stdout).strip()

    @staticmethod
    def run_result(command: list[str], seconds: float, hidden: dict | None = None) -> subprocess.CompletedProcess | None:
        try:
            return subprocess.run(command, capture_output=True, text=True, timeout=seconds, stdin=subprocess.DEVNULL, env={**os.environ, **(hidden or {})})
        except (OSError, subprocess.TimeoutExpired):
            return None
