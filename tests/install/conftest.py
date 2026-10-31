import subprocess

import pytest

from tests.install.support import GO_TOOLS, LiveJournal


@pytest.fixture
def journal(tmp_path):
    live = LiveJournal(tmp_path)
    yield live
    live.close()
    assert live.left_running is None, f"the test left the server {live.left_running} running"


@pytest.fixture(scope="module")
def client(tmp_path_factory):
    binary = tmp_path_factory.mktemp("client") / "journal"
    built = subprocess.run(["go", "build", "-o", str(binary), "./journal"], cwd=GO_TOOLS, capture_output=True, text=True, timeout=300)
    assert built.returncode == 0, built.stderr
    return binary
