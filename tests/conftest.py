import os
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

from tests import isolation  # noqa: E402

isolation.settle()

import pytest  # noqa: E402

from engine.record import Record  # noqa: E402


def fresh(env: str = "t") -> Record:
    return Record(Path(tempfile.mkdtemp(dir=isolation.world())) / ".journal", env)


def refused(fn) -> str:
    try:
        fn()
        return ""
    except Exception as e:
        return str(e)


def pytest_configure(config):
    config.addinivalue_line("markers", "xdist_group(name): keep these tests on one worker")


def pytest_collection_modifyitems(config, items):
    for item in items:
        name = isolation.group(Path(str(item.fspath)))
        if name:
            item.add_marker(pytest.mark.xdist_group(name))


def pytest_sessionfinish(session, exitstatus):
    isolation.sweep()


@pytest.fixture
def free_port():
    taken = []

    def take():
        port = isolation.reserve()
        taken.append(port)
        return port

    yield take
    for port in taken:
        isolation.release(port)


@pytest.fixture(autouse=True)
def viewer_ports(monkeypatch):
    viewer = sys.modules.get("engine.viewer")
    if viewer is None:
        yield
        return
    ours = isolation.band()
    monkeypatch.setattr(viewer, "PORTS", ours)
    yield
    for port in ours:
        isolation.release(port)
