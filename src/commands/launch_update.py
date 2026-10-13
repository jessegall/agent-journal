import os
import sys
from pathlib import Path

from engine import runtime
from engine.heal import refused
from engine.version import version
from framework.loaded import running
from framework.updating.check import failure_in, journal_repository
from features.auto_update.feature import AutoUpdate
from engine.upgrades import fetched, newer

TRIED = "AGENT_JOURNAL_INSTALLED_BEFORE_START"


def restart(root: Path) -> None:
    os.execv(sys.executable, [sys.executable, str(root / "journal.py"), *sys.argv[1:]])


def took(root: Path, latest: str) -> bool:
    """Whether an install left the journal on the version it was asked for: the code folder says so, or the build the journal starts from is named for it."""
    from engine.package import ARCHIVE, code
    from install import version_in
    return version_in(code(root)) == latest or (root / ARCHIVE).resolve().name.startswith(f"journal-{latest}-")


def repaired(record) -> None:
    from install import finish, half_done
    root = Path(record.root)
    if half_done(root):
        print("journal: finishing an upgrade that stopped halfway", flush=True)
        finish(root.parent, root)
        restart(root)


def latest_first(record) -> str:
    root = Path(record.root)
    feature = running(AutoUpdate)
    if journal_repository(root.parent):
        return ""
    try:
        repaired(record)
        if not feature or not feature.on(record):
            return ""
        cache = runtime.upstream_cache(root)
        fetched(cache)
        latest = cache.read_text().strip() if cache.is_file() else ""
        if not newer(latest, version()) or refused(root, latest):
            return ""
        if os.environ.get(TRIED) == latest:
            return f"{latest} was installed but this start still runs {version()}, so it starts on {version()} and does not try again"
        from install import upgrade
        print(f"journal: installing {latest} before it starts", flush=True)
        lines = upgrade(root.parent, root)
        failed = failure_in(lines)
        if failed:
            return failed
        if not took(root, latest):
            return f"{latest} was not installed: {next((line for line in lines if line), 'the upgrade said nothing')}"
        os.environ[TRIED] = latest
        restart(root)
    except Exception as error:
        return f"the update check did not finish: {error}"
    return ""
