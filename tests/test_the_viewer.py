import json
import os
import socket
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

import pytest

from scripts.boot_guard import PROJECT

HERE = Path(__file__).resolve().parents[1]
CODE = HERE / "src"
WEB = CODE / "web"
VITEST = WEB / "node_modules" / ".bin" / "vitest"
PLAYWRIGHT = WEB / "node_modules" / "playwright-core"
BOOT_WAIT = 60
UNITS_WAIT = 300
SCENARIOS_WAIT = 240

needs_node_modules = pytest.mark.skipif(not VITEST.is_file() or not PLAYWRIGHT.is_dir(), reason="the viewer's npm packages are not installed")


def free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


@pytest.fixture(scope="module")
def scratch_viewer(tmp_path_factory):
    """A scratch install of this build, served on a port of its own."""
    place = tmp_path_factory.mktemp("viewer")
    for agent in (".claude", ".codex"):
        (place / PROJECT / agent).mkdir(parents=True)
    env = {**os.environ, "HOME": str(place / "home"), "AGENT_JOURNAL_BOOTSTRAPPED": "1"}
    subprocess.run([sys.executable, str(CODE / "install.py"), "upgrade", str(place / PROJECT)], env=env, capture_output=True, timeout=120, check=True)
    root = place / PROJECT / ".journal"
    port = free_port()
    server = subprocess.Popen([sys.executable, str(root / "journal.py"), "--root", str(root), "serve", "--port", str(port)],
                              cwd=root.parent, env={**env, "AGENT_JOURNAL_ACTIVE": "1"}, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    url = f"http://127.0.0.1:{port}/"
    began = time.time()
    while time.time() - began < BOOT_WAIT:
        try:
            urllib.request.urlopen(f"{url}api/manifest", timeout=3).read()
            break
        except OSError:
            time.sleep(0.5)
    else:
        server.kill()
        pytest.fail("the scratch install's server did not answer")
    yield url
    server.terminate()
    server.wait(BOOT_WAIT)


@needs_node_modules
def test_the_viewers_own_code_passes_its_unit_tests():
    run = subprocess.run([str(VITEST), "run"], cwd=WEB, capture_output=True, text=True, timeout=UNITS_WAIT)
    assert run.returncode == 0, run.stdout[-3000:] + run.stderr[-1000:]


@needs_node_modules
@pytest.mark.parametrize("script", ["boot", "phone", "settings"])
def test_the_viewer_answers_every_state_in_a_browser(scratch_viewer, script):
    run = subprocess.run(["node", f"browser/{script}.mjs", scratch_viewer], cwd=WEB, capture_output=True, text=True, timeout=SCENARIOS_WAIT)
    assert run.returncode == 0, run.stderr[-2000:]
    assert json.loads(run.stdout.strip().splitlines()[-1]) == {}
