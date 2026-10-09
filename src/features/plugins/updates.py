import time
from dataclasses import asdict, dataclass
from pathlib import Path

from controllers.faults import threw
from controllers.types import Plugins
from engine import runtime
from engine.record import Record
from engine.runtime import default_env
from engine.stored import write_text
from features.plugins.lifecycle import fetched
from features.plugins.declared import called
from features.plugins.staging import Unreached
from resources.base import SYSTEM

CHECK_EVERY = 24 * 3600
WAKE_EVERY = 3600


@dataclass(frozen=True)
class Newer:
    """The version a plugin's repository holds beyond the installed commit; empty when the installed commit is the newest."""
    name: str = ""
    version: str = ""
    commit: str = ""


def keep(root: Path) -> None:
    while True:
        try:
            if due(root):
                check(root)
        except Exception:
            threw(root, default_env(root), "checking plugins for a newer version")
        time.sleep(WAKE_EVERY)


def stamp(root: Path) -> Path:
    return runtime.folder(root) / "plugin-updates"


def due(root: Path) -> bool:
    try:
        return time.time() - stamp(root).stat().st_mtime >= CHECK_EVERY
    except OSError:
        return True


def check(root: Path) -> None:
    """Looks in each installed plugin's repository for a commit newer than the one installed, and keeps what it finds on the plugin's row."""
    plugins = Plugins(Record(Path(root), default_env(Path(root))), actor=SYSTEM)
    for row in plugins.rows.standing():
        if row.linked or not row.source:
            continue
        try:
            plugins.update(row.n, update=asdict(found(Path(root), row)))
        except Unreached:
            continue
    write_text(stamp(root), str(time.time()))


def found(root: Path, row) -> Newer:
    with fetched(root, row.source, row.revision) as stage:
        if stage.commit == row.commit:
            return Newer()
        return Newer(called(row), stage.manifest.version, stage.commit)
