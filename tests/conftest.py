import json
import os
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

from tests import isolation  # noqa: E402

import pytest  # noqa: E402

from engine.record import Record  # noqa: E402
from engine.runtime import TESTS_RUNNING  # noqa: E402
from engine import locks  # noqa: E402
from controllers import stored  # noqa: E402


def fresh(env: str = "t") -> Record:
    record = Record(Path(tempfile.mkdtemp(dir=isolation.world())) / ".journal", env)
    record.home.mkdir(parents=True)
    return record


def holds(record: Record, session: str = "claude-1") -> dict:
    from engine.gates import Hold, gate_file
    f = gate_file(record.root, record.env, session)
    return {key: Hold.from_json(raw).why for key, raw in json.loads(f.read_text()).items()} if f.is_file() else {}


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


LIVE_RUNTIME = isolation.REPO / ".journal" / "runtime"


def pytest_sessionstart(session):
    if isolation.worker() == "master" and LIVE_RUNTIME.is_dir():
        (LIVE_RUNTIME / TESTS_RUNNING).write_text(str(os.getpid()))


def pytest_sessionfinish(session, exitstatus):
    isolation.sweep()
    if isolation.worker() == "master":
        (LIVE_RUNTIME / TESTS_RUNNING).unlink(missing_ok=True)


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
def closed_handles():
    yield
    locks.close_all()
    stored.close_all()


@pytest.fixture(autouse=True)
def ports_of_its_own(monkeypatch):
    import engine.services as services
    import engine.viewer as viewer
    ours, served = isolation.band(), isolation.band()
    monkeypatch.setattr(viewer, "PORTS", ours)
    monkeypatch.setattr(services, "PORTS", served)
    monkeypatch.setenv("JOURNAL_VIEWER_PORTS", ",".join(map(str, ours)))
    yield
    for port in [*ours, *served]:
        isolation.release(port)


@pytest.fixture(autouse=True)
def outside_the_callers_session(monkeypatch):
    for name in ("JOURNAL_ENV", "JOURNAL_SESSION", "JOURNAL_AGENT", "JOURNAL_ACTOR"):
        monkeypatch.delenv(name, raising=False)


@pytest.fixture(autouse=True)
def forgotten_memos():
    from engine.memo import forget_all
    forget_all()
    yield


_VIEWER_FUNCTIONS = {}


@pytest.fixture(autouse=True)
def viewer_functions_restored(request, monkeypatch):
    import engine.viewer as viewer
    names = ("running", "start", "launch", "show", "identity", "answers", "elsewhere", "available", "free")
    if not _VIEWER_FUNCTIONS:
        _VIEWER_FUNCTIONS.update({name: getattr(viewer, name) for name in names})
    yield
    monkeypatch.undo()
    changed = [name for name in names if getattr(viewer, name) is not _VIEWER_FUNCTIONS[name]]
    for name in changed:
        setattr(viewer, name, _VIEWER_FUNCTIONS[name])
    assert not changed, f"{request.node.nodeid} left engine.viewer.{', '.join(changed)} replaced for every later test"


@pytest.fixture
def hosted_world(tmp_path):
    """A hosted journal and two local copies in scratch folders, real processes once started; imported here so a run that never asks for it never installs one."""
    from features.connection.world import World
    world = World(tmp_path)
    try:
        yield world
    finally:
        world.close()
