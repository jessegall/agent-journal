import time
from pathlib import Path

from engine import runtime
from engine.package import ARCHIVE, point
from engine.sessions import held_builds
from engine.stored import read_json, write_json


REFUSED_FOR = 12 * 3600
ANSWER_WITHIN = 2.0


def ledger(root: Path) -> Path:
    return runtime.folder(root) / "broken.json"


def broken(root: Path) -> list[str]:
    return list(read_json(ledger(root), dict, {}).get("builds") or [])


def refused(root: Path, version: str) -> bool:
    since = read_json(ledger(root), dict, {}).get("at") or {}
    return any(name.startswith(f"journal-{version}-") and time.time() - since.get(name, 0) < REFUSED_FOR for name in broken(root))


def answering(root: Path, build: str) -> bool:
    """Whether the server of this journal answers and runs this build."""
    from engine.viewer import identity, running
    url = running(root)
    reply = identity(url, ANSWER_WITHIN) if url else None
    return reply is not None and reply.build == build


def heal(root: Path) -> str:
    """What an agent asks for when it believes the installed build is broken: refused while the build is being installed or its server answers."""
    root = Path(root)
    current = (root / ARCHIVE).resolve()
    if runtime.upgrading(root):
        return f"journal: {current.name} is still being installed, so nothing was rolled back"
    if answering(root, current.name):
        return f"journal: {current.name} is running and answering, so nothing was rolled back"
    return rolled_back(root, current)


def healed_after_death(root: Path) -> str:
    """What a supervisor asks for when the worker of the installed build died on start: the build's server may answer and the build is still broken."""
    root = Path(root)
    current = (root / ARCHIVE).resolve()
    if runtime.upgrading(root):
        return f"journal: {current.name} is still being installed, so nothing was rolled back"
    return rolled_back(root, current)


def rolled_back(root: Path, current: Path) -> str:
    bad = sorted({*broken(root), current.name})
    kept = [build for build in root.glob("journal-*.pyz") if build.name not in bad]
    if not kept:
        return ""
    previous = max(kept, key=lambda build: build.stat().st_mtime)
    at = {**(read_json(ledger(root), dict, {}).get("at") or {}), current.name: time.time()}
    write_json(ledger(root), {"builds": bad, "at": at})
    point(root, previous)
    return f"journal: {current.name} would not start, so the journal went back to {previous.name}"


def pruned(root: Path) -> list[str]:
    """Removes every build but the one running once it has started, except a build a process still runs from; the next update has this one to go back to, and an older version is fetched from git when it is wanted."""
    root = Path(root)
    if not (root / ARCHIVE).exists():
        return []
    current = (root / ARCHIVE).resolve()
    held = held_builds(root)
    removed = []
    for build in root.glob("journal-*.pyz"):
        if build.resolve() != current and build.name not in held:
            build.unlink(missing_ok=True)
            removed.append(build.name)
    return removed
