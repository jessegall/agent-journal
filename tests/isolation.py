import fcntl
import os
import shutil
import signal
import socket
import sys
import tempfile
import time
from collections.abc import Callable
from pathlib import Path

from engine.runtime import TEST_OWNER

REPO = Path(__file__).resolve().parents[1]
HOME = "AGENT_JOURNAL_HOME"
OFFLINE = REPO / "tests" / "fixtures" / "offline-bin"
BAND = 6
KEPT_FOLDERS = 3
KEPT = "agent-journal-kept"
HELD_BY = "held.lock"
UNHELD_FOR = 3600
"""How old a run folder with no lock must be before it is taken for left behind: one made by a run of the code before runs held theirs."""
HELD = None
SERIAL = {
    "tests/test_viewer_port.py": "viewer",
    "tests/test_hook_server.py": "viewer",
    "tests/test_watch.py": "viewer",
    "tests/test_services.py": "services",
    "tests/features/plugins/test_services.py": "services",
    "tests/test_install.py": "install",
    "tests/test_cli.py": "install",
    "tests/features/plugins/test_host.py": "plugins",
    "tests/features/plugins/test_run.py": "plugins",
    "tests/features/plugins/test_install.py": "plugins",
}


def worker() -> str:
    return os.environ.get("PYTEST_XDIST_WORKER", "master")


def run() -> str:
    return os.environ.get("PYTEST_XDIST_TESTRUNUID") or f"pid{os.getpid()}"


def base() -> Path:
    where = Path(tempfile.gettempdir()) / f"agent-journal-{run()}"
    where.mkdir(parents=True, exist_ok=True)
    return where


def world() -> Path:
    where = base() / worker()
    where.mkdir(parents=True, exist_ok=True)
    return where


def made_once(folder: Path, name: str, make: Callable[[Path], None]) -> Path:
    folder.mkdir(parents=True, exist_ok=True)
    where, made = folder / name, folder / f"{name}.made"
    with open(folder / f"{name}.lock", "w") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        if not made.is_file() or not where.is_dir():
            shutil.rmtree(where, ignore_errors=True)
            make(where)
            made.touch()
    return where


def shared(name: str, make: Callable[[Path], None]) -> Path:
    """A folder the first worker to ask makes once for the whole run, and every worker reads."""
    return made_once(base(), name, make)


def kept(name: str, make: Callable[[Path], None]) -> Path:
    """A folder made once for everything named alike, across runs, so a run on unchanged code finds it already made."""
    folder = Path(tempfile.gettempdir()) / KEPT
    where = made_once(folder, name, make)
    os.utime(where)
    for old in sorted((f for f in folder.iterdir() if f.is_dir()), key=lambda f: f.stat().st_mtime, reverse=True)[KEPT_FOLDERS:]:
        shutil.rmtree(old, ignore_errors=True)
        old.with_name(f"{old.name}.made").unlink(missing_ok=True)
    return where


def home() -> Path:
    where = world() / "home" / "sandboxer"
    where.mkdir(parents=True, exist_ok=True)
    return where


def claimed() -> Path:
    where = base() / "ports"
    where.mkdir(parents=True, exist_ok=True)
    return where


def settle() -> None:
    os.environ.setdefault("PLAYWRIGHT_BROWSERS_PATH", str(browsers()))
    os.environ[HOME] = str(home())
    os.environ["HOME"] = str(home())
    os.environ["CLAUDE_CONFIG_DIR"] = str(home())
    os.environ["PATH"] = offline(os.environ["PATH"])
    os.environ["JOURNAL_ENV"] = "main"
    os.environ[TEST_OWNER] = str(os.getpid())
    os.environ["AGENT_JOURNAL_REPO"] = str(Path(tempfile.gettempdir()) / "no-journal-releases")
    for away in ("CLAUDE_CODE_MESSAGING_SOCKET", "JOURNAL_ROOT", "AGENT_JOURNAL_ROOT"):
        os.environ.pop(away, None)


def browsers() -> Path:
    return Path.home() / ("Library/Caches" if sys.platform == "darwin" else ".cache") / "ms-playwright"


def offline(path: str) -> str:
    return os.pathsep.join([str(OFFLINE), *(part for part in path.split(os.pathsep) if part != str(OFFLINE))])


def reserve() -> int:
    for _ in range(200):
        with socket.socket() as probe:
            probe.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            probe.bind(("127.0.0.1", 0))
            port = probe.getsockname()[1]
        try:
            (claimed() / str(port)).touch(exist_ok=False)
        except FileExistsError:
            continue
        return port
    raise RuntimeError("no free port could be reserved")


def release(port: int) -> None:
    (claimed() / str(port)).unlink(missing_ok=True)


def band(size: int = BAND) -> list[int]:
    return [reserve() for _ in range(size)]


def hold() -> None:
    """The run's folder is held for as long as the process that started the run lives, so a run that starts later knows it from one a killed run left behind."""
    global HELD
    HELD = open(base() / HELD_BY, "w")
    fcntl.flock(HELD, fcntl.LOCK_EX)


def sweep_left_behind() -> None:
    """Removes the folders of runs that ended without removing their own, killed or timed out, and the ones older runs left before they were held."""
    for folder in Path(tempfile.gettempdir()).glob("agent-journal-*"):
        if folder.name == KEPT or folder == base() or not folder.is_dir():
            continue
        if (folder / HELD_BY).is_file() and not unheld(folder / HELD_BY):
            continue
        if not (folder / HELD_BY).is_file() and time.time() - folder.stat().st_mtime < UNHELD_FOR:
            continue
        shutil.rmtree(folder, ignore_errors=True)
    for left in (*Path(tempfile.gettempdir()).glob("scenario-*.png"), *Path(tempfile.gettempdir()).glob("shown-*")):
        if time.time() - left.stat().st_mtime < UNHELD_FOR:
            continue
        if left.is_dir():
            shutil.rmtree(left, ignore_errors=True)
            continue
        left.unlink(missing_ok=True)


def unheld(lock: Path) -> bool:
    with open(lock, "a") as probe:
        try:
            fcntl.flock(probe, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return False
        return True


def sweep() -> None:
    if worker() == "master":
        stop_strays()
        shutil.rmtree(base(), ignore_errors=True)


def ours(root: str) -> bool:
    runs, served = Path(tempfile.gettempdir()).resolve(), Path(root).resolve()
    return served.is_relative_to(runs) and served.relative_to(runs).parts[0].startswith("agent-journal-")


def stop_strays() -> None:
    from engine.viewer import PORTS, identity
    for port in PORTS:
        found = identity(f"http://127.0.0.1:{port}/", timeout=0.2)
        if found and found.pid and ours(found.root):
            try:
                os.kill(found.pid, signal.SIGTERM)
            except ProcessLookupError:
                pass


def group(path: Path) -> str:
    try:
        text = path.resolve().relative_to(REPO).as_posix()
    except ValueError:
        return ""
    return SERIAL.get(text, "")


def bare(**more) -> dict:
    """An environment hand-made for a child that must not inherit this session's, carrying the one thing it cannot do without: this worker's viewer ports. A journal that does not know its band falls back to 8420, which the live journal owns, and the test then waits on a server that never answers it."""
    import engine.viewer as viewer
    return {"PATH": "/usr/bin:/bin", "JOURNAL_VIEWER_PORTS": ",".join(str(port) for port in viewer.PORTS), **more}
