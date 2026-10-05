import os
import sys
from pathlib import Path

from controllers.types import Notices
from engine import runtime
from engine.heal import refused
from engine.version import version
from features import running
from features.auto_update.check import failure_in, journal_repository
from features.auto_update.feature import AutoUpdate
from resources.base import SYSTEM
from engine.upgrades import fetched, newer
from migrations import ran

LOST = "Project records were lost in the 2.84.0 upgrade - restore them from a backup"
RESTORE = ("Docs, rules, templates, checks and tools were deleted by the 2.84.0 upgrade. Restore the folder "
           ".journal/resources from a backup such as Time Machine; the next launch moves it into .journal/project.")


def restart(root: Path) -> None:
    os.execv(sys.executable, [sys.executable, str(root / "journal.py"), *sys.argv[1:]])


def lost(record) -> bool:
    root = Path(record.root)
    runs = ran(root)
    moved = runs["m0000_project_resources"].result if "m0000_project_resources" in runs else ""
    kept = any((root / "project").rglob("*.md")) if (root / "project").is_dir() else False
    return "into resources/" in moved and not kept


def repaired(record) -> str:
    from install import finish, half_done
    root = Path(record.root)
    if half_done(root):
        print("journal: finishing an upgrade that stopped halfway", flush=True)
        finish(root.parent, root)
        restart(root)
    if lost(record) and not any(n.title == LOST for n in Notices(record, actor=SYSTEM).all()):
        Notices(record, actor=SYSTEM).create(LOST, brief=RESTORE, tone="warn")
        return LOST
    return ""


def latest_first(record) -> str:
    root = Path(record.root)
    feature = running(AutoUpdate)
    if journal_repository(root.parent):
        return ""
    try:
        notice = repaired(record)
        if not feature or not feature.on(record):
            return notice
        cache = runtime.upstream_cache(root)
        fetched(cache)
        latest = cache.read_text().strip() if cache.is_file() else ""
        if not newer(latest, version()) or refused(root, latest):
            return notice
        from install import upgrade
        print(f"journal: installing {latest} before it starts", flush=True)
        failed = failure_in(upgrade(root.parent, root))
        if failed:
            return failed
        restart(root)
    except Exception as error:
        return f"the update check did not finish: {error}"
    return ""
