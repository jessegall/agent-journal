from pathlib import Path

from controllers.types import Notifications
from engine import runtime
from engine.record import Record
from engine.runtime import default_env
from engine.stored import write_text
from engine.version import version as package_version
from resources.base import SYSTEM
from features.journal_laws.managed import LEGACY_COPY_MARKER

KIND = "update"


def announce(root: Path, version: str = "") -> str:
    version = version or package_version()
    seen = runtime.folder(root) / "version"
    before = seen.read_text().strip() if seen.is_file() else ""
    if before == version:
        return ""
    seen.parent.mkdir(parents=True, exist_ok=True)
    write_text(seen, version)
    copy_note = runtime.folder(root) / LEGACY_COPY_MARKER
    location = copy_note.read_text().strip() if copy_note.is_file() else ""
    if not before and not location:
        return ""
    record = Record(Path(root), default_env(Path(root)))
    brief = f"The journal went from {before} to {version}." if before else f"The journal updated to {version}."
    if location:
        brief += f" Managed files from before the update were copied to {location}."
    Notifications(record, actor=SYSTEM)._logged(f"Journal updated to {version}", brief=brief,
                                               kind=KIND, version=version)
    copy_note.unlink(missing_ok=True)
    return version
