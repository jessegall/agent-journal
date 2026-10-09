import os
import shutil
import socket
import subprocess
import sys
import time
import urllib.request
from pathlib import Path
from typing import NamedTuple

import pytest

from scripts.boot_guard import PROJECT, ended
from tests import phone_pages, shared_pages
from tests.conftest import installed_once
from tests.kit import bound_to_this_run

HERE = Path(__file__).resolve().parents[1]
CODE = HERE / "src"
WEB = CODE / "web"
VITEST = WEB / "node_modules" / ".bin" / "vitest"
PLAYWRIGHT = WEB / "node_modules" / "playwright-core"
BOOT_WAIT = 60
UNITS_WAIT = 300
HELPERS = {"harness", "proxy", "chromium"}
PHONE_HELPERS = {"paired"}

needs_node_modules = pytest.mark.skipif(not VITEST.is_file() or not PLAYWRIGHT.is_dir(), reason="the viewer's npm packages are not installed")


def free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


class Scratch(NamedTuple):
    url: str
    root: Path


@pytest.fixture(scope="module")
def scratch_viewer(tmp_path_factory):
    """A copy of the run's one install of this build, served on a port of its own."""
    place = tmp_path_factory.mktemp("viewer")
    shutil.copytree(installed_once().parents[1], place, symlinks=True, dirs_exist_ok=True)
    env = {**os.environ, "HOME": str(place / "home"), "AGENT_JOURNAL_BOOTSTRAPPED": "1"}
    root = place / PROJECT / ".journal"
    port = free_port()
    server = subprocess.Popen(bound_to_this_run([sys.executable, str(root / "journal.py"), "--root", str(root), "serve", "--port", str(port)]),
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
        server.terminate()
        server.wait(BOOT_WAIT)
        pytest.fail("the scratch install's server did not answer")
    try:
        yield Scratch(url, root)
    finally:
        server.terminate()
        server.wait(BOOT_WAIT)
        ended(place)


@needs_node_modules
def test_the_viewers_own_code_passes_its_unit_tests():
    run = subprocess.run([str(VITEST), "run"], cwd=WEB, capture_output=True, text=True, timeout=UNITS_WAIT)
    assert run.returncode == 0, run.stdout[-3000:] + run.stderr[-1000:]


@needs_node_modules
@pytest.mark.parametrize("script", sorted(path.stem for path in (WEB / "browser").glob("*.mjs") if path.stem not in HELPERS))
def test_the_viewer_answers_every_state_in_a_browser(shared_browser, scratch_viewer, script):
    shared_browser.play(f"browser/{script}.mjs", scratch_viewer.url, JOURNAL_SCRATCH_ROOT=str(scratch_viewer.root), JOURNAL_SCRATCH_URL=scratch_viewer.url,
                        JOURNAL_PYTHON=sys.executable)


@needs_node_modules
def test_a_shared_page_answers_every_state_a_visitor_meets(shared_browser):
    with shared_pages.served() as pages:
        shared_browser.play("browser/shared/page.mjs", SHARED_OPEN=pages.open, SHARED_ENDED=pages.ended, SHARED_MISSING=pages.missing)


@needs_node_modules
@pytest.mark.parametrize("script", sorted(path.stem for path in (WEB / "browser" / "phoneapp").glob("*.mjs") if path.stem not in PHONE_HELPERS))
def test_a_paired_phone_answers_every_state_in_a_browser(shared_browser, script):
    with phone_pages.served() as page:
        shared_browser.play(f"browser/phoneapp/{script}.mjs", page.pair, page.desk)


@needs_node_modules
def test_a_paired_phone_settings_work_in_a_browser(shared_browser):
    with phone_pages.served() as page:
        shared_browser.play("browser/phoneapp/settings.mjs", page.pair, page.desk)
