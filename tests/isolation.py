import fcntl
import os
import shutil
import signal
import socket
import sys
import tempfile
from collections.abc import Callable
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
HOME = "AGENT_JOURNAL_HOME"
OFFLINE = REPO / "tests" / "fixtures" / "offline-bin"
BAND = 6
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


def shared(name: str, make: Callable[[Path], None]) -> Path:
    """A folder the first worker to ask makes once for the whole run, and every worker reads."""
    where, made = base() / name, base() / f"{name}.made"
    with open(base() / f"{name}.lock", "w") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        if not made.is_file():
            shutil.rmtree(where, ignore_errors=True)
            make(where)
            made.touch()
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
