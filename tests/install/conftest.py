import subprocess

import pytest

from tests.install.support import TOOLS_FOLDER, ServerScratch


@pytest.fixture
def journal(tmp_path):
    server_scratch = ServerScratch(tmp_path)
    yield server_scratch
    server_scratch.close()
    assert server_scratch.left_running is None, f"the test left the server {server_scratch.left_running} running"


@pytest.fixture(scope="module")
def client(tmp_path_factory):
    binary = tmp_path_factory.mktemp("client") / "journal"
    build_run = subprocess.run(["go", "build", "-o", str(binary), "./journal"], cwd=TOOLS_FOLDER, capture_output=True, text=True, timeout=300)
    assert build_run.returncode == 0, build_run.stderr
    return binary
