import socket
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import features  # noqa: E402
from controllers.types import Plugins  # noqa: E402
from engine.services import DOWN, Manager, PORTS, UP, allocate, log_file, specs, states, status, status_file, want, wanted  # noqa: E402
from engine.services import want_file  # noqa: E402
from engine.stored import read_json, write_json  # noqa: E402
from features.plugins.source import folder, home  # noqa: E402
from resources.base import SYSTEM  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

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

# EACH SERVICE BECOMES ONE SPEC, with its own files and a filled-in command
web, queue = specs(root)
check("a service is named plugin.service and knows where it runs", (web["id"], queue["id"], Path(web["cwd"]).name), ("works.web", "works.queue", "host"))
check("an auto port is taken from the service range and put into the command", (web["port"] in PORTS, web["run"], web["url"]),
      (True, f"php artisan serve --port={web['port']}", f"http://127.0.0.1:{web['port']}"))
check("another service can name that port too", queue["run"], f"php artisan queue:work --url=http://127.0.0.1:{web['port']}")
check("a service with no port of its own gets none", (queue["port"], queue["url"]), (0, ""))
check("the plugin's own environment rides along, filled in", web["env"]["DB"].endswith("plugin-data/works/db.sqlite"), True)
check("its files sit beside the other runtime files", (Path(web["log"]).name, Path(web["status"]).name, Path(web["lock"]).name),
      ("service-works.web.log", "service-works.web.json", "service-works.web.lock"))
check("restart rules come through, with on-failure as the default", (web["restart"], queue["restart"]), ("on-failure", "always"))

# A PORT ALREADY IN USE is reported rather than fought over
with socket.socket() as sock:
    sock.bind(("127.0.0.1", 0))
    sock.listen(1)
    busy = sock.getsockname()[1]
    check("a fixed port that is taken is called out", allocate(root, "works.web", busy, set()), (busy, f"port {busy} is in use"))
    check("an auto port never lands on one already given out", allocate(root, "works.queue", "auto", {PORTS.start})[0] != PORTS.start, True)

# THE PORT IT HAD LAST TIME is kept when it is still free
write_json(status_file(root, "works.web"), {"port": PORTS.start + 5})
check("a service comes back on the port it had", allocate(root, "works.web", "auto", set()), (PORTS.start + 5, ""))

# UP AND DOWN are said in one place, and read back
check("a service is wanted up unless something says otherwise", wanted(root, "works.web"), UP)
want(root, "works.web", DOWN)
check("asking for it to stop is written down", wanted(root, "works.web"), DOWN)
check("a restart is the same word with a new nonce", want(root, "works.web", UP, nonce=12.5), {"want": UP, "nonce": 12.5})

# WHAT IS RUNNING is read from the state files
check("states are read by service", sorted(states(root)), ["works.web"])
check("a log is one file per service", log_file(root, "works.web").name, "service-works.web.log")

# THE MANAGER STARTS WHAT IS WANTED, backs off when it keeps stopping, and gives up saying why
started = []
clock = [1000.0]
running = {4242}
manager = Manager(root, start=lambda spec, lifeline: started.append(spec["id"]) or 4242, clock=lambda: clock[0], living=lambda pid: pid in running)
want(root, "works.web", UP)
check("what is wanted and not running is started", (manager.tick(), status(root, "works.web")["state"]), (["works.web", "works.queue"], "starting"))
check("what is already running is left alone", manager.tick(), [])

# A SERVICE THAT STOPS is started again, but only after it has waited
def exited(sid: str = "works.web"):
    write_json(status_file(root, sid), {**status(root, sid), "state": "exited", "at": clock[0]})


exited()
check("the stop is noticed and it is left to wait", (manager.tick(), status(root, "works.web")["state"]), ([], "exited"))
clock[0] += 5
check("once the wait is over it is started again", manager.tick(), ["works.web"])

# STOPPING AGAIN AND AGAIN makes each wait longer, and five within a minute gives up
for wait in (2, 4, 8, 16):
    exited()
    manager.tick()
    clock[0] += wait - 0.5
    check(f"after {wait} seconds it is still waiting", manager.tick(), [])
    clock[0] += 1
    manager.tick()
exited()
manager.tick()
check("five stops within the minute leaves it failed, saying why", (status(root, "works.web")["state"], "5 times" in status(root, "works.web")["why"]), ("failed", True))
clock[0] += 120
check("and it stays failed, however long it waits", manager.tick(), [])
want(root, "works.web", UP, nonce=clock[0])
check("asking for it again starts it", manager.tick(), ["works.web"])

# ASKED TO STOP, nothing is started
want(root, "works.queue", DOWN)
quiet = Manager(root, start=lambda spec, lifeline: started.append("never") or 1, clock=lambda: clock[0], living=lambda pid: pid in running)
check("a service asked to stop is not started", "works.queue" in quiet.tick(), False)
want(root, "works.queue", UP)

# A PORT THAT IS TAKEN is reported, not fought over
with socket.socket() as sock:
    sock.bind(("127.0.0.1", 0))
    sock.listen(1)
    busy = sock.getsockname()[1]
    Plugins(record, actor=SYSTEM).update(1, manifest={"name": "works", "services": {"fixed": {"run": "serve", "port": busy}}})
    blocked = Manager(root, start=lambda spec, lifeline: started.append("blocked") or 1, clock=lambda: clock[0], living=lambda pid: pid in running)
    blocked.tick()
    check("a service whose port is taken says so and is not started", (status(root, "works.fixed")["state"], "in use" in status(root, "works.fixed")["why"], "blocked" in started), ("blocked", True, False))

# A GROUP LEFT BEHIND by a dead keeper is killed
left = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(60)"], start_new_session=True)
write_json(status_file(root, "works.orphan"), {"state": "ready", "keeper": 999999, "owner": 999999, "pgid": left.pid})
Manager(root, start=lambda spec, lifeline: 1, clock=lambda: clock[0], living=lambda pid: pid in running).sweep()
left.wait(timeout=10)
check("a service whose keeper is gone is taken down", (left.poll() is not None, status(root, "works.orphan")["state"]), (True, "stopped"))

# A PLUGIN THAT IS OFF declares no services
Plugins(record, actor=SYSTEM).update(1, enabled=False)
check("a plugin switched off runs nothing", specs(root), [])

# THE COMMAND lists what is declared, asks for start, stop and restart, and reads a log
def journal(*argv):
    out = subprocess.run([sys.executable, str(Path(__file__).resolve().parents[1] / "journal.py"), "--root", str(root), "--env", record.env, *argv],
                         capture_output=True, text=True, timeout=60)
    return out.returncode, (out.stdout + out.stderr).strip()

Plugins(record, actor=SYSTEM).update(1, enabled=True, manifest={"name": "works", "services": {"web": {"run": "serve --port={port}", "port": "auto"}}})
code, listed = journal("services")
web = next(line for line in listed.splitlines() if line.startswith("works.web"))
check("the list names each service, its state and its address", (code, "http://127.0.0.1:" in web, "works.fixed" in listed), (0, True, True))
check("stopping is asked for in plain words", journal("services", "stop", "works.web"), (0, "works.web is asked to stop"))
check("and the ask is written down", wanted(root, "works.web"), DOWN)
check("starting says so too", (journal("services", "start", "works.web")[1], wanted(root, "works.web")), ("works.web is asked to run", UP))
before = read_json(want_file(root, "works.web"), {})["nonce"]
check("a restart is the same ask with a fresh nonce", (journal("services", "restart", "works.web")[0], read_json(want_file(root, "works.web"), {})["nonce"] > before), (0, True))
check("a start with no service named is refused, saying how", journal("services", "start")[1], "! say which service to start: journal services start <plugin>.<service>")
check("a word it does not know is refused", journal("services", "sideways")[1].startswith("! services knows list, up, start, stop, restart and log"), True)
log_file(root, "works.web").write_text("one\ntwo\nthree\n")
check("a log is read from its end", journal("services", "log", "works.web", "--lines", "2")[1], "two\nthree")

done()
