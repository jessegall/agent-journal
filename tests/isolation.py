import os
import shutil
import signal
import socket
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
HOME = "AGENT_JOURNAL_HOME"
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


VIEWER_BAND = range(8420, 8440)


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


def home() -> Path:
    where = world() / "home"
    where.mkdir(parents=True, exist_ok=True)
    return where


def claimed() -> Path:
    where = base() / "ports"
    where.mkdir(parents=True, exist_ok=True)
    return where


def settle() -> None:
    os.environ[HOME] = str(home())
    os.environ["CLAUDE_CONFIG_DIR"] = str(home())
    os.environ["JOURNAL_ENV"] = "main"
    for away in ("CLAUDE_CODE_MESSAGING_SOCKET", "JOURNAL_ROOT", "AGENT_JOURNAL_ROOT"):
        os.environ.pop(away, None)


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


def stop_strays() -> None:
    from engine.viewer import identity
    runs = Path(tempfile.gettempdir()).resolve()
    for port in VIEWER_BAND:
        found = identity(f"http://127.0.0.1:{port}/", timeout=0.2)
        if found and found.pid and Path(found.root).resolve().is_relative_to(runs) and Path(found.root).resolve().relative_to(runs).parts[0].startswith("agent-journal-"):
            try:
                os.kill(found.pid, signal.SIGTERM)
            except OSError:
                pass


def group(path: Path) -> str:
    try:
        text = path.resolve().relative_to(REPO).as_posix()
    except ValueError:
        return ""
    return SERIAL.get(text, "")
