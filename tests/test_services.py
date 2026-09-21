import socket
import subprocess
import sys
from pathlib import Path

import pytest

import features
from controllers.types import Plugins
from engine.services import DOWN, Manager, PORTS, UP, allocate, log_file, specs, states, status, status_file, want, wanted
from engine.services import want_file
from engine.stored import read_json, write_json
from features.plugins.source import folder, home
from resources.base import SYSTEM
from tests.conftest import fresh

HERE = Path(__file__).resolve().parents[1]


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_service_manager_specs_ports_and_the_running_manager():
    record = fresh()
    root = record.root
    where = folder(root, "works")
    home(root).mkdir(parents=True, exist_ok=True)
    where.mkdir(parents=True, exist_ok=True)
    Plugins(record, actor=SYSTEM).create("works", enabled=True, token="t0ken", settings={}, manifest={
        "name": "works",
        "env": {"DB": "{data}/db.sqlite"},
        "services": {"web": {"run": "php artisan serve --port={port}", "port": "auto", "ready": {"path": "/up"}, "cwd": "host"},
                     "queue": {"run": "php artisan queue:work --url=http://127.0.0.1:{ports.web}", "restart": "always"}}})

    web, queue = specs(root)
    assert (web["id"], queue["id"], Path(web["cwd"]).name) == ("works.web", "works.queue", "host"), \
        "a service is named plugin.service and knows where it runs"
    assert (web["port"] in PORTS, web["run"], web["url"]) == (True, f"php artisan serve --port={web['port']}", f"http://127.0.0.1:{web['port']}"), \
        "an auto port is taken from the service range and put into the command"
    assert queue["run"] == f"php artisan queue:work --url=http://127.0.0.1:{web['port']}", "another service can name that port too"
    assert (queue["port"], queue["url"]) == (0, ""), "a service with no port of its own gets none"
    assert web["env"]["DB"].endswith("plugin-data/works/db.sqlite") is True, "the plugin's own environment rides along, filled in"
    assert (Path(web["log"]).name, Path(web["status"]).name, Path(web["lock"]).name) == \
        ("service-works.web.log", "service-works.web.json", "service-works.web.lock"), "its files sit beside the other runtime files"
    assert (web["restart"], queue["restart"]) == ("on-failure", "always"), "restart rules come through, with on-failure as the default"

    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        sock.listen(1)
        busy = sock.getsockname()[1]
        assert allocate(root, "works.web", busy, set()) == (busy, f"port {busy} is in use"), "a fixed port that is taken is called out"
        assert allocate(root, "works.queue", "auto", {PORTS.start})[0] != PORTS.start, "an auto port never lands on one already given out"

    write_json(status_file(root, "works.web"), {"port": PORTS.start + 5})
    assert allocate(root, "works.web", "auto", set()) == (PORTS.start + 5, ""), "a service comes back on the port it had"

    assert wanted(root, "works.web") == UP, "a service is wanted up unless something says otherwise"
    want(root, "works.web", DOWN)
    assert wanted(root, "works.web") == DOWN, "asking for it to stop is written down"
    assert want(root, "works.web", UP, nonce=12.5) == {"want": UP, "nonce": 12.5}, "a restart is the same word with a new nonce"

    assert sorted(states(root)) == ["works.web"], "states are read by service"
    assert log_file(root, "works.web").name == "service-works.web.log", "a log is one file per service"

    started = []
    clock = [1000.0]
    running = {4242}
    manager = Manager(root, start=lambda spec, lifeline: started.append(spec["id"]) or 4242, clock=lambda: clock[0], living=lambda pid: pid in running)
    want(root, "works.web", UP)
    assert (manager.tick(), status(root, "works.web")["state"]) == (["works.web", "works.queue"], "starting"), \
        "what is wanted and not running is started"
    assert manager.tick() == [], "what is already running is left alone"

    def exited(sid="works.web"):
        write_json(status_file(root, sid), {**status(root, sid), "state": "exited", "at": clock[0]})

    exited()
    assert (manager.tick(), status(root, "works.web")["state"]) == ([], "exited"), "the stop is noticed and it is left to wait"
    clock[0] += 5
    assert manager.tick() == ["works.web"], "once the wait is over it is started again"

    for wait in (2, 4, 8, 16):
        exited()
        manager.tick()
        clock[0] += wait - 0.5
        assert manager.tick() == [], f"after {wait} seconds it is still waiting"
        clock[0] += 1
        manager.tick()
    exited()
    manager.tick()
    assert (status(root, "works.web")["state"], "5 times" in status(root, "works.web")["why"]) == ("failed", True), \
        "five stops within the minute leaves it failed, saying why"
    clock[0] += 120
    assert manager.tick() == [], "and it stays failed, however long it waits"
    want(root, "works.web", UP, nonce=clock[0])
    assert manager.tick() == ["works.web"], "asking for it again starts it"

    want(root, "works.queue", DOWN)
    quiet = Manager(root, start=lambda spec, lifeline: started.append("never") or 1, clock=lambda: clock[0], living=lambda pid: pid in running)
    assert ("works.queue" in quiet.tick()) is False, "a service asked to stop is not started"
    want(root, "works.queue", UP)

    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        sock.listen(1)
        busy = sock.getsockname()[1]
        Plugins(record, actor=SYSTEM).update(1, manifest={"name": "works", "services": {"fixed": {"run": "serve", "port": busy}}})
        blocked = Manager(root, start=lambda spec, lifeline: started.append("blocked") or 1, clock=lambda: clock[0], living=lambda pid: pid in running)
        blocked.tick()
        assert (status(root, "works.fixed")["state"], "in use" in status(root, "works.fixed")["why"], "blocked" in started) == ("blocked", True, False), \
            "a service whose port is taken says so and is not started"

    mine = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(30)"], start_new_session=True)
    write_json(status_file(root, "works.live"), {"state": "ready", "keeper": 4242, "owner": 0, "pgid": mine.pid})
    Manager(root, start=lambda spec, lifeline: 1, clock=lambda: clock[0], living=lambda pid: pid in running).sweep()
    assert mine.poll() is None, "a service whose keeper is alive is not swept, even with no owner recorded"
    mine.kill()
    mine.wait(timeout=10)

    left = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(60)"], start_new_session=True)
    write_json(status_file(root, "works.orphan"), {"state": "ready", "keeper": 999999, "owner": 999999, "pgid": left.pid})
    Manager(root, start=lambda spec, lifeline: 1, clock=lambda: clock[0], living=lambda pid: pid in running).sweep()
    left.wait(timeout=10)
    assert (left.poll() is not None, status(root, "works.orphan")["state"]) == (True, "stopped"), "a service whose keeper is gone is taken down"

    Plugins(record, actor=SYSTEM).update(1, enabled=False)
    assert specs(root) == [], "a plugin switched off runs nothing"

    def journal(*argv):
        out = subprocess.run([sys.executable, str(HERE / "journal.py"), "--root", str(root), "--env", record.env, *argv],
                             capture_output=True, text=True, timeout=60)
        return out.returncode, (out.stdout + out.stderr).strip()

    Plugins(record, actor=SYSTEM).update(1, enabled=True, manifest={"name": "works", "services": {"web": {"run": "serve --port={port}", "port": "auto"}}})
    code, listed = journal("services")
    web = next(line for line in listed.splitlines() if line.startswith("works.web"))
    assert (code, "http://127.0.0.1:" in web, "works.fixed" in listed) == (0, True, True), \
        "the list names each service, its state and its address"
    assert journal("services", "stop", "works.web") == (0, "works.web is asked to stop"), "stopping is asked for in plain words"
    assert wanted(root, "works.web") == DOWN, "and the ask is written down"
    assert (journal("services", "start", "works.web")[1], wanted(root, "works.web")) == ("works.web is asked to run", UP), "starting says so too"
    before = read_json(want_file(root, "works.web"), {})["nonce"]
    assert (journal("services", "restart", "works.web")[0], read_json(want_file(root, "works.web"), {})["nonce"] > before) == (0, True), \
        "a restart is the same ask with a fresh nonce"
    assert journal("services", "start")[1] == "! say which service to start: journal services start <plugin>.<service>", \
        "a start with no service named is refused, saying how"
    assert journal("services", "sideways")[1].startswith("! services knows list, up, start, stop, restart and log") is True, \
        "a word it does not know is refused"
    log_file(root, "works.web").write_text("one\ntwo\nthree\n")
    assert journal("services", "log", "works.web", "--lines", "2")[1] == "two\nthree", "a log is read from its end"
