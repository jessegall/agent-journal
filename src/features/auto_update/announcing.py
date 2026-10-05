from pathlib import Path

from controllers.types import Notifications
from engine import runtime
from engine.record import Record
from engine.runtime import default_env
from engine.stored import write_text
from engine.version import version as package_version
from resources.base import SYSTEM

KIND = "update"


def announce(root: Path, version: str = "") -> str:
    version = version or package_version()
    seen = runtime.folder(root) / "version"
    before = seen.read_text().strip() if seen.is_file() else ""
    if before == version:
        return ""
    seen.parent.mkdir(parents=True, exist_ok=True)
    write_text(seen, version)
    if not before:
        return ""
    record = Record(Path(root), default_env(Path(root)))
    Notifications(record, actor=SYSTEM)._logged(f"Journal updated to {version}", brief=f"The journal went from {before} to {version}.",
                                               kind=KIND, version=version)
    return version
