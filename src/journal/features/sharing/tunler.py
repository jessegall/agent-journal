import json
import os
import platform
import shutil
import ssl
import subprocess
from pathlib import Path
from urllib.request import urlopen

from journal.engine.kept_answer import KeptAnswer
from journal.features.sharing.tunler_login import TunlerLogin
from journal.features.sharing.tunler_status import TunlerStatus
from journal.features.sharing.tunler_version import TunlerVersion
from journal.refused import Refused

ELSEWHERE = (Path("/opt/homebrew/bin/tunler"), Path("/usr/local/bin/tunler"))
STATUS_SECONDS = 5
STATUS_KEPT = 60
COMMAND_SECONDS = 30
DOWNLOAD_SECONDS = 60
KILLED = -9
ARCHES = {"x86_64": "amd64", "amd64": "amd64", "aarch64": "arm64", "arm64": "arm64"}
CERTIFICATES = ("Python on this machine has no root certificates, so it cannot check the tunler server, and curl could not download tunler either. "
                "On macOS, open the Python folder under Applications and run Install Certificates.command, then try again.")
BLOCKED = "macOS stopped the downloaded tunler from running, even after signing it on this machine. The tunler already here, if any, is kept."
NOT_WORKING = "what the server sent is not a working tunler, so nothing was replaced: the tunler already here, if any, is kept"


class Tunler:
    """The tunler program on this machine, which gives the journal its web address: its status, asked at most once a minute, its login, its version and the domains its account holds."""

    def __init__(self) -> None:
        self._status = KeptAnswer(lambda: self.asked(), STATUS_KEPT, TunlerStatus(installed=False))

    def command(self) -> str:
        return shutil.which("tunler") or next((str(path) for path in (self.local(), Path.home() / "go" / "bin" / "tunler", *ELSEWHERE) if path.is_file()), "")

    @staticmethod
    def local() -> Path:
        """Where the journal installs tunler: in the user's own bin folder."""
        return Path.home() / ".local" / "bin" / "tunler"

    def status(self) -> TunlerStatus:
        """Tunler's status, asked once while the journal waits and kept after: a later one past its time is asked again on a thread of its own."""
        return self._status.now() if self._status.asked_on else self._status.fresh()

    def forget(self) -> None:
        """Tunler is asked again now, after a change such as a login."""
        self._status.fresh()

    def asked(self) -> TunlerStatus:
        command = self.command()
        if not command:
            return TunlerStatus(installed=False)
        done = self.ran([command, "status", "--json"], STATUS_SECONDS)
        try:
            fields = json.loads(done.stdout) if done else None
        except ValueError:
            fields = None
        if not isinstance(fields, dict):
            return TunlerStatus(installed=True, command=command, unreadable=True)
        saved = bool(fields.get("logged_in"))
        return TunlerStatus(installed=True, command=command, logged_in=saved and bool(fields.get("auth_ok")), rejected=saved and fields.get("auth_ok") is False,
                            outdated=saved and "auth_ok" not in fields, account=fields.get("user") or fields.get("email", ""), host=fields.get("host", ""))

    def log_in(self, host: str, username: str, password: str, master: str) -> TunlerLogin:
        hidden = {"TUNLER_PASSWORD": password}
        if master:
            hidden["TUNLER_MASTER_PASSWORD"] = master
        ok, output = self.told("login", username, f"--host={host}", hidden=hidden)
        if ok:
            return TunlerLogin(connected=True)
        lines = output.splitlines() or ["tunler refused the login"]
        needs = "master password" in output.lower() and not master
        return TunlerLogin(connected=False, needs_master=needs, error=lines[0] if needs else lines[-1])

    def log_out(self) -> None:
        ok, output = self.told("logout")
        if not ok:
            raise Refused(output or "tunler did not log out")

    def versions(self, host: str) -> TunlerVersion:
        ok, output = self.told("update", "--check", "--json", f"--host={host}")
        try:
            reported = json.loads(output) if ok else {}
        except ValueError:
            reported = {}
        if "update_available" in reported:
            return TunlerVersion(reported.get("current", ""), reported.get("latest", ""), bool(reported["update_available"]))
        current, newest = self.installed_version(), self.latest(host)
        return TunlerVersion(current, newest, bool(current and newest and current != newest))

    def installed_version(self) -> str:
        ok, output = self.told("version")
        return output.split()[-1] if ok and output else ""

    @staticmethod
    def latest(host: str) -> str:
        try:
            with urlopen(f"https://{host}/_tunler/version", timeout=STATUS_SECONDS) as answer:
                return str(json.loads(answer.read()).get("version", ""))
        except (OSError, ValueError):
            return ""

    def update(self) -> str:
        ok, output = self.told("update")
        if not ok:
            raise Refused(output or "tunler did not update")
        return output.splitlines()[-1] if output else "tunler is up to date"

    def domains(self) -> list[str]:
        ok, output = self.told("domains")
        return [line.strip() for line in output.splitlines() if line.strip()] if ok else []

    def release(self, domain: str, host: str) -> str:
        """Why the domain was not given back to the server; empty when it was."""
        ok, output = self.told("release", domain.removesuffix(f".{host}"))
        return "" if ok else output or f"tunler did not release {domain}"

    def install(self, host: str) -> str:
        """Downloads tunler for this machine from the server into ~/.local/bin; a download that does not run as tunler replaces nothing."""
        arch = platform.machine().lower()
        part = self.local().with_name("tunler.part")
        part.parent.mkdir(parents=True, exist_ok=True)
        self.download(f"https://{host}/dl/tunler-{platform.system().lower()}-{ARCHES.get(arch, arch)}", part, host)
        part.chmod(0o700)
        version = self.verified(part)
        part.replace(self.local())
        self.forget()
        return f"tunler {version} is installed"

    def download(self, url: str, part: Path, host: str) -> None:
        try:
            with urlopen(url, timeout=DOWNLOAD_SECONDS) as answer:
                part.write_bytes(answer.read())
            return
        except OSError as error:
            if not isinstance(getattr(error, "reason", error), ssl.SSLCertVerificationError):
                part.unlink(missing_ok=True)
                raise Refused(f"tunler could not be downloaded from {host}: {error}") from error
        curl = shutil.which("curl")
        done = self.ran([curl, "-fsSL", "-o", str(part), url], DOWNLOAD_SECONDS) if curl else None
        if not done or done.returncode:
            part.unlink(missing_ok=True)
            raise Refused(CERTIFICATES)

    def verified(self, binary: Path) -> str:
        """The version a downloaded tunler reports; on macOS one the system kills is signed on this machine and tried once more."""
        done = self.ran([str(binary), "version"], STATUS_SECONDS)
        if done and done.returncode == KILLED and platform.system() == "Darwin":
            self.ran(["codesign", "--force", "--sign", "-", str(binary)], STATUS_SECONDS)
            done = self.ran([str(binary), "version"], STATUS_SECONDS)
        if done and done.returncode == 0 and done.stdout.startswith("tunler "):
            return done.stdout.split()[-1]
        binary.unlink(missing_ok=True)
        raise Refused(BLOCKED if done and done.returncode == KILLED else NOT_WORKING)

    def told(self, *words: str, hidden: dict | None = None) -> tuple[bool, str]:
        """Whether a tunler command went through, and what it said: its output, or its error when it failed."""
        command = self.command()
        if not command:
            return False, "tunler isn't installed on this machine"
        done = self.ran([command, *words], COMMAND_SECONDS, hidden)
        if done is None:
            return False, f"tunler {words[0]} did not finish"
        self.forget()
        return done.returncode == 0, (done.stdout if done.returncode == 0 else done.stderr or done.stdout).strip()

    @staticmethod
    def ran(command: list[str], seconds: float, hidden: dict | None = None) -> subprocess.CompletedProcess | None:
        """The finished program, or none when it could not start or ran past its time."""
        try:
            return subprocess.run(command, capture_output=True, text=True, timeout=seconds, stdin=subprocess.DEVNULL, env={**os.environ, **(hidden or {})})
        except (OSError, subprocess.TimeoutExpired):
            return None
