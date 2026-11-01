import hashlib
import re
import tarfile
import tempfile
import urllib.request
from pathlib import Path

from core.base.refusal import Refusal
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.updates.models.support.update_setting import UpdateSetting
from core.modules.updates.support.published_release import PublishedRelease

ARCHIVE = "agent-journal.tar.gz"
CHECKSUMS = "checksums.txt"
LIMIT_SECONDS = 30
TAG = re.compile(r"/releases/download/([^/]+)/")


class ReleaseSource:
    """The release address install.sh downloads from: its checksums.txt read for the archive's SHA-256, and the
    archive downloaded, checked against it and unpacked into a folder of its own."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def newest(self) -> PublishedRelease:
        address = self.address()
        text, final_address = self.fetched(f"{address}/{CHECKSUMS}")
        checksum = next((line.split()[0] for line in text.decode(errors="replace").splitlines() if line.split()[1:] == [ARCHIVE]), "")
        if not checksum:
            raise Refusal(f"the release at {address} lists no {ARCHIVE} in its {CHECKSUMS}")
        tag = TAG.search(final_address)
        return PublishedRelease(address, checksum, tag[1] if tag else "")

    def unpacked(self, release: PublishedRelease, folder: Path) -> Path:
        archive, _ = self.fetched(f"{release.address}/{ARCHIVE}")
        if hashlib.sha256(archive).hexdigest() != release.checksum:
            raise Refusal(f"the checksum of {ARCHIVE} does not match the release's, so nothing was installed", "check the release address, then try again")
        with tempfile.NamedTemporaryFile(suffix=".tar.gz") as download:
            download.write(archive)
            download.flush()
            with tarfile.open(download.name, "r:gz") as unpacking:
                unpacking.extractall(folder, filter="data")
        return folder / "src"

    def address(self) -> str:
        return self.settings.text(UpdateSetting.RELEASE_ADDRESS.key, None).rstrip("/")

    @staticmethod
    def fetched(address: str) -> tuple[bytes, str]:
        try:
            with urllib.request.urlopen(address, timeout=LIMIT_SECONDS) as response:
                return response.read(), response.geturl()
        except (OSError, ValueError) as error:
            raise Refusal(f"the release at {address.rsplit('/', 1)[0]} could not be read: {error}", "check the release address in the settings") from error
