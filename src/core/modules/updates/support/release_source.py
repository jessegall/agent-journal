from core.base.file_access import FileAccess
import hashlib
import json
import re
import tarfile
import tempfile
import urllib.request
from http import HTTPStatus
from pathlib import Path
from urllib.error import HTTPError

from core.base.clock import Clock
from core.base.journal_home import JournalHome
from engine.errors.refusal import Refusal
from core.base.timestamp import Timestamp
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.updates.models.support.update_setting import UpdateSetting
from core.modules.updates.support.published_release import PublishedRelease
from core.modules.updates.support.missing_release_download_error import MissingReleaseDownloadError

ARCHIVE = "agent-journal.tar.gz"
CHECKSUMS = "checksums.txt"
LIMIT_SECONDS = 30
KEPT_SECONDS = 3600
FAILURE_KEPT_SECONDS = 300
TAG = re.compile(r"/releases/download/([^/]+)/")


class ReleaseSource:
    """The release address install.sh downloads from: its checksums.txt read for the archive's SHA-256, and
    the archive downloaded, checked against it and unpacked into a folder of its own."""

    def __init__(self, settings: SettingValues, home: JournalHome, clock: Clock) -> None:
        self.settings, self.home, self.clock = settings, home, clock

    # The newest release; one answered in the last hour, or a failure in the last five minutes, is kept in a
    # file, so a page asking for it does not wait on the network each time. An install asks the network.
    def newest(self, online: bool = False) -> PublishedRelease:
        address = self.address()
        saved = None if online else self.kept(address)
        if saved is not None:
            if "failure" in saved:
                raise Refusal(str(saved["failure"]), "check the release address in the settings")
            return PublishedRelease(address, str(saved["checksum"]), str(saved["tag"]))
        try:
            release = self.fetched_newest(address)
        except Refusal as refusal:
            self.keep({"address": address, "failure": refusal.reason})
            raise
        self.keep({"address": address, "checksum": release.checksum, "tag": release.tag})
        return release

    def fetched_newest(self, address: str) -> PublishedRelease:
        text, final_address = self.fetched(f"{address}/{CHECKSUMS}")
        checksum = next((line.split()[0] for line in text.decode(errors="replace").splitlines() if line.split()[1:] == [ARCHIVE]), "")
        if not checksum:
            raise Refusal(f"the release at {address} lists no {ARCHIVE} in its {CHECKSUMS}")
        tag = TAG.search(final_address)
        return PublishedRelease(address, checksum, tag[1] if tag else "")

    def kept(self, address: str) -> dict[str, object] | None:
        try:
            saved = json.loads(FileAccess.shared().read(self.home.newest_release_file))
            age = (self.clock.timestamp().value - Timestamp.parsed(str(saved["at"])).value).total_seconds()
        except (OSError, ValueError, KeyError):
            return None
        limit = FAILURE_KEPT_SECONDS if "failure" in saved else KEPT_SECONDS
        return saved if saved.get("address") == address and 0 <= age < limit else None

    def keep(self, values: dict[str, object]) -> None:
        self.home.newest_release_file.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(self.home.newest_release_file, json.dumps({**values, "at": self.clock.timestamp().text}))

    def unpacked(self, release: PublishedRelease, folder: Path) -> Path:
        archive, _ = self.fetched(f"{release.address}/{ARCHIVE}")
        if hashlib.sha256(archive).hexdigest() != release.checksum:
            raise Refusal(f"the checksum of {ARCHIVE} does not match the release's, so nothing was installed", "check the release address, then try again")
        with FileAccess.shared().temporary_writer(Path(tempfile.gettempdir()), mode="w+b", suffix=".tar.gz") as download:
            download.write(archive)
            download.flush()
            with tarfile.open(download.name, "r:gz") as unpacking:
                unpacking.extractall(folder, filter="data")
        return folder / "src"

    def address(self) -> str:
        return self.settings.project.text(UpdateSetting.RELEASE_ADDRESS.key).rstrip("/")

    @staticmethod
    def fetched(address: str) -> tuple[bytes, str]:
        try:
            with urllib.request.urlopen(address, timeout=LIMIT_SECONDS) as response:
                return response.read(), response.geturl()
        except (OSError, ValueError) as error:
            if isinstance(error, HTTPError) and error.code == HTTPStatus.NOT_FOUND and address.endswith(f"/{CHECKSUMS}"):
                raise MissingReleaseDownloadError.create(address.rsplit("/", 1)[0]) from error
            raise Refusal(f"the release at {address.rsplit('/', 1)[0]} could not be read: {error}", "check the release address in the settings") from error
