import os
import shutil
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

import pytest

from engine.stored import read_json, write_json

HERE = Path(__file__).resolve().parents[1]


def waiting(until, seconds=20.0):
    end = time.monotonic() + seconds
    while time.monotonic() < end:
        if until():
            return True
        time.sleep(0.1)
    return False


def answers(port):
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{port}/", timeout=1) as got:
            return got.read().decode().strip() == "alive"
    except (urllib.error.URLError, OSError):
        return False


def free_port():
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


@pytest.mark.skipif(not shutil.which("php"), reason="php is not on this machine, so the live service test is skipped")
def test_a_real_php_server_runs_under_the_keeper_and_is_taken_down_with_it(tmp_path):
    (tmp_path / "index.php").write_text("<?php echo 'alive';\n")
    port = free_port()
    spec = tmp_path / "spec.json"
    write_json(spec, {"run": f"php -S 127.0.0.1:{port} -t {tmp_path}", "cwd": str(tmp_path), "env": {"PHP_CLI_SERVER_WORKERS": "2"},
                      "lock": str(tmp_path / "php.lock"), "log": str(tmp_path / "php.log"), "status": str(tmp_path / "php-status.json"),
                      "port": port, "path": "/", "grace": 2, "owner": os.getpid()})

    read, write = os.pipe()
    os.set_inheritable(read, True)
    kept = subprocess.Popen([sys.executable, str(HERE / "engine" / "keeper.py"), str(read), str(spec)],
                            pass_fds=(read,), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    assert waiting(lambda: answers(port)) is True, "the server answers on its port"
    assert waiting(lambda: read_json(tmp_path / "php-status.json", {}).get("state") == "ready") is True, "and the keeper says it is ready"
    group = read_json(tmp_path / "php-status.json", {})["pgid"]
    children = subprocess.run(["pgrep", "-g", str(group)], capture_output=True, text=True, timeout=10).stdout.split()
    assert len(children) >= 1, "php has spawned more than the one process the keeper started"

    os.close(write)
    os.close(read)
    assert kept.wait(timeout=20) == 0, "the keeper stops"
    assert waiting(lambda: not subprocess.run(["pgrep", "-g", str(group)], capture_output=True, text=True, timeout=10).stdout.strip()) is True, \
        "no php process of that group is left"
    assert waiting(lambda: not answers(port)) is True, "and the port is free again"
