from engine.file.file_access import FileAccess
import platform
import shutil
import ssl
import subprocess
from pathlib import Path
from urllib.request import urlopen

from engine.errors.refusal import Refusal

ARCHITECTURES = {"x86_64": "amd64", "amd64": "amd64", "aarch64": "arm64", "arm64": "arm64"}
DOWNLOAD_LIMIT_SECONDS = 60
VERSION_LIMIT_SECONDS = 5
KILLED_CODE = -9
CERTIFICATES_MISSING = ("Python on this machine has no root certificates, so it cannot check the tunler server, and curl could not download tunler either. "
                        "On macOS, open the Python folder under Applications and run Install Certificates.command, then try again.")
BLOCKED = "macOS stopped the downloaded tunler from running, even after signing it on this machine. The tunler already here, if any, is kept."
BROKEN_PROGRAM = "what the server sent is not a working tunler, so nothing was replaced: the tunler already here, if any, is kept"


class TunlerInstaller:
    """Downloads tunler from a tunler server to this user's local bin folder, and puts it in place only once
    it runs."""

    def local_path(self) -> Path:
        return Path.home() / ".local" / "bin" / "tunler"

    def install(self, host: str) -> str:
        target = self.local_path()
        part = target.with_name("tunler.part")
        FileAccess.mkdir(part.parent, parents=True, exist_ok=True)
        self.download(host, part)
        FileAccess.chmod(part, 0o700)
        version = self.checked_version(part)
        FileAccess.replace(part, target)
        return f"tunler {version} is installed"

    def download(self, host: str, part: Path) -> None:
        machine = platform.machine().lower()
        url = f"https://{host}/dl/tunler-{platform.system().lower()}-{ARCHITECTURES.get(machine, machine)}"
        try:
            with urlopen(url, timeout=DOWNLOAD_LIMIT_SECONDS) as answer:
                FileAccess.write_binary(part, answer.read())
            return
        except OSError as error:
            if not isinstance(getattr(error, "reason", error), ssl.SSLCertVerificationError):
                FileAccess.unlink(part, missing_ok=True)
                raise Refusal(f"tunler could not be downloaded from {host}: {error}") from error
        curl = shutil.which("curl")
        finished = self.finished([curl, "-fsSL", "-o", str(part), url], DOWNLOAD_LIMIT_SECONDS) if curl else None
        if finished is None or finished.returncode:
            FileAccess.unlink(part, missing_ok=True)
            raise Refusal(CERTIFICATES_MISSING)

    def checked_version(self, program: Path) -> str:
        finished = self.finished([str(program), "version"], VERSION_LIMIT_SECONDS)
        if finished is not None and finished.returncode == KILLED_CODE and platform.system() == "Darwin":
            self.finished(["codesign", "--force", "--sign", "-", str(program)], VERSION_LIMIT_SECONDS)
            finished = self.finished([str(program), "version"], VERSION_LIMIT_SECONDS)
        if finished is not None and finished.returncode == 0 and finished.stdout.startswith("tunler "):
            return finished.stdout.split()[-1]
        FileAccess.unlink(program, missing_ok=True)
        raise Refusal(BLOCKED if finished is not None and finished.returncode == KILLED_CODE else BROKEN_PROGRAM)

    @staticmethod
    def finished(command: list[str], limit_seconds: float) -> subprocess.CompletedProcess[str] | None:
        try:
            return subprocess.run(command, capture_output=True, text=True, timeout=limit_seconds, stdin=subprocess.DEVNULL)
        except (OSError, subprocess.TimeoutExpired):
            return None
