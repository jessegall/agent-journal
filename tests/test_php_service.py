import os
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine.stored import read_json, write_json  # noqa: E402
from tests.kit import check, done  # noqa: E402

HERE = Path(__file__).resolve().parents[1]


def waiting(until, seconds: float = 20.0) -> bool:
    end = time.monotonic() + seconds
    while time.monotonic() < end:
        if until():
            return True
        time.sleep(0.1)
    return False


def answers(port: int) -> bool:
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{port}/", timeout=1) as got:
            return got.read().decode().strip() == "alive"
    except (urllib.error.URLError, OSError):
        return False


def free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


if not shutil.which("php"):
    check("php is not on this machine, so the live service test is skipped", True, True)
    done()
    raise SystemExit(0)

where = Path(tempfile.mkdtemp())
(where / "index.php").write_text("<?php echo 'alive';\n")
port = free_port()
spec = where / "spec.json"
write_json(spec, {"run": f"php -S 127.0.0.1:{port} -t {where}", "cwd": str(where), "env": {"PHP_CLI_SERVER_WORKERS": "2"},
                  "lock": str(where / "php.lock"), "log": str(where / "php.log"), "status": str(where / "php-status.json"),
                  "port": port, "path": "/", "grace": 2, "owner": os.getpid()})

read, write = os.pipe()
os.set_inheritable(read, True)
kept = subprocess.Popen([sys.executable, str(HERE / "engine" / "keeper.py"), str(read), str(spec)],
                        pass_fds=(read,), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# A REAL PHP SERVER runs under the keeper and is seen as ready
check("the server answers on its port", waiting(lambda: answers(port)), True)
check("and the keeper says it is ready", waiting(lambda: read_json(where / "php-status.json", {}).get("state") == "ready"), True)
group = read_json(where / "php-status.json", {})["pgid"]
children = subprocess.run(["pgrep", "-g", str(group)], capture_output=True, text=True, timeout=10).stdout.split()
check("php has spawned more than the one process the keeper started", len(children) >= 1, True)

# CLOSING THE LIFELINE takes every php process with it
os.close(write)
os.close(read)
check("the keeper stops", kept.wait(timeout=20), 0)
check("no php process of that group is left", waiting(lambda: not subprocess.run(["pgrep", "-g", str(group)], capture_output=True, text=True, timeout=10).stdout.strip()), True)
check("and the port is free again", waiting(lambda: not answers(port)), True)

done()
