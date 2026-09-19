import socket
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import features  # noqa: E402
from controllers.types import Plugins  # noqa: E402
from engine.services import DOWN, PORTS, UP, allocate, log_file, specs, states, status_file, want, wanted  # noqa: E402
from engine.stored import write_json  # noqa: E402
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

# A PLUGIN THAT IS OFF declares no services
Plugins(record, actor=SYSTEM).update(1, enabled=False)
check("a plugin switched off runs nothing", specs(root), [])

done()
