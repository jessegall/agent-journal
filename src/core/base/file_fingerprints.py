import hashlib
import json
from collections.abc import Sequence
from pathlib import Path

from core.base.file_access import FileAccess
from core.base.journal_home import JournalHome

FINGERPRINT_FILE = "file-fingerprints.json"
BIGGEST_FILE_BYTES = 1_000_000


class FileFingerprints:
    """One shared way for any part of the journal to ask which files are new or changed since its own last
    pass: each named pass keeps a fingerprint of the content of every file it has finished with, in a file
    under the journal's folder, so the memory survives a restart. A pass remembers a file only when it says
    it is done with it."""

    def __init__(self, home: JournalHome) -> None:
        self.file = home.folder / FINGERPRINT_FILE

    def changed(self, pass_name: str, files: Sequence[Path]) -> list[Path]:
        known = self.known(pass_name)
        return [file for file in files if known.get(str(file)) != self.fingerprint(file)]

    def done(self, pass_name: str, files: Sequence[Path]) -> None:
        if not files:
            return
        everything = self.stored()
        known = everything.setdefault(pass_name, {})
        for file in files:
            known[str(file)] = self.fingerprint(file)
        FileAccess.shared().write(self.file, json.dumps(everything))

    def known(self, pass_name: str) -> dict[str, str]:
        return self.stored().get(pass_name, {})

    def stored(self) -> dict[str, dict[str, str]]:
        return json.loads(FileAccess.shared().read(self.file)) if self.file.exists() else {}

    @staticmethod
    def fingerprint(file: Path) -> str:
        if not file.is_file() or file.stat().st_size > BIGGEST_FILE_BYTES:
            return ""
        return hashlib.sha256(FileAccess.shared().binary(file)).hexdigest()
