from pathlib import Path

from controllers.types import Notifications
from engine.record import Record
from features.base import Feature
from resources.base import SYSTEM

PACKAGE = Path(__file__).resolve().parents[2]


def counted(version: str) -> tuple:
    return tuple(int(part) if part.isdigit() else 0 for part in str(version).split("."))


def newer(version: str, than: str) -> bool:
    return bool(version and than) and counted(version) > counted(than)


class Updates(Feature):
    name = "updates"
    title_ = "Journal updates"
    abstract_ = "When the journal's package changes version, the Activity panel says so, highlighted"
    help_ = "Checked when the viewer's server starts: a version other than the last one seen writes a notification marked as an update; a first install only notes the version."
    fixed = True
    KIND = "update"

    def announce(self, root: Path, version: str = "") -> str:
        version = version or (PACKAGE / "VERSION").read_text().strip()
        seen = Path(root) / "runtime" / "version"
        before = seen.read_text().strip() if seen.is_file() else ""
        if before == version:
            return ""
        seen.parent.mkdir(parents=True, exist_ok=True)
        seen.write_text(version)
        if not before:
            return ""
        start = Path(root) / "runtime" / "env"
        record = Record(Path(root), start.read_text().strip() if start.is_file() else "main")
        Notifications(record, actor=SYSTEM).create(f"Journal updated to {version}", brief=f"The journal went from {before} to {version}.", kind=self.KIND, version=version)
        return version
