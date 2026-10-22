# Installs code-commandments from GitHub under a real supervisor and upgrades it, so it is not in the default run: python3 -m pytest -q tests/plugin_upgrade_process_run.py
"""A plugin upgrade under a real supervisor leaves the agent and the supervisor running: the agent here is a shell, the plugin the real code-commandments."""

import os
import threading
import time
from pathlib import Path

from supervisor.inbox import Inbox
from supervisor.service import Service
from supervisor.services import Services
from supervisor.supervisor import Supervisor
from supervisor.terminal import Terminal
from journal.support.project_command import ProjectCommand
from tests.test_features import USER, app

SOURCE = "https://github.com/jessegall/code-commandments"


def test_an_upgrade_leaves_the_agent_running(app, tmp_path: Path):
    terminal = Terminal(["sh", "-c", "sleep 600"], str(tmp_path), {"PATH": os.environ["PATH"]})
    inbox = Inbox(Path(f"/tmp/journal-{os.getuid()}") / f"upgrade-test-{os.getpid()}.sock", app.config.home / "runtime" / "inboxes" / "main")
    journal = Service("journal", ["sh", "-c", "sleep 600"], tmp_path, {"PATH": os.environ["PATH"]}, tmp_path / "server.log")
    keys, _ = os.pipe()
    supervisor = Supervisor(terminal, inbox, Services(journal), stdin=keys, stdout=os.open(os.devnull, os.O_WRONLY))
    inbox.open()
    terminal.start()
    journal.start()
    stopping, faults = threading.Event(), []

    def turn() -> None:
        """The supervisor's loop, as run() turns it; a fault that would end the supervisor is kept for the test."""
        try:
            while not stopping.is_set():
                supervisor.relay_once(0.05)
                supervisor.services.revive_stopped()
        except Exception as fault:
            faults.append(fault)
    loop = threading.Thread(target=turn, daemon=True)
    loop.start()
    ProjectCommand(app.config.root, Path(__file__).parents[1] / "src" / "journal.sh").write()
    (app.config.root / "shop.py").write_text("PRICE = 3\n")
    try:
        installed = app.console().run(["plugin", "install", SOURCE, "--yes"], USER)
        assert installed.code == 0, installed.error
        print("after install:", [(p["name"], p["running"]) for p in supervisor.described()])
        assert terminal.pid > 0 and terminal.exited() is None, "the agent runs after the install"
        import resource
        began, previous = time.monotonic(), resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        upgraded = app.console().run(["plugin", "upgrade", "code-commandments", "--yes"], USER)
        print("upgrade took", round(time.monotonic() - began, 1), "s; peak memory rose by", (resource.getrusage(resource.RUSAGE_SELF).ru_maxrss - previous) // (1024 * 1024), "MB")
        print("upgrade:", upgraded.code, upgraded.text[-300:], upgraded.error[-300:])
        time.sleep(1)
        print("after upgrade:", [(p["name"], p["running"]) for p in supervisor.described()])
        assert faults == [], "the supervisor's loop survives the upgrade, or the supervisor would end and the agent with it"
        assert terminal.exited() is None, "the agent runs after the upgrade"
    finally:
        stopping.set()
        loop.join()
        supervisor.stop()
        supervisor.services.stop_all()
        inbox.close()
