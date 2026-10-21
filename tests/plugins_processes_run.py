# Starts a real supervisor and a plugin's service on a unix socket, so it is not in the default run: python3 -m pytest -q tests/plugins_processes_run.py, before any commit that touches a plugin's services.
"""A plugin's service run by a real supervisor: started when the plugin is installed, it answers a held event on its socket in place of the program, and with the supervisor gone the program answers again."""

import json
import os
import shutil
import threading
import time
from pathlib import Path

from journal.features.plugins.support.plugin_folders import PluginFolders
from journal.repositories.plugins import Plugins
from supervisor.inbox import Inbox
from supervisor.service import Service
from supervisor.services import Services
from supervisor.supervisor import Supervisor
from supervisor.terminal import Terminal
from tests.test_features import USER, app, hook


def test_a_plugins_service_answers_a_held_event_on_its_socket(app, tmp_path: Path):
    terminal = Terminal(["sh", "-c", "sleep 60"], str(tmp_path), {"PATH": os.environ["PATH"]})
    inbox = Inbox(Path(f"/tmp/journal-{os.getuid()}") / f"plugins-test-{os.getpid()}.sock", app.config.home / "runtime" / "inboxes" / "main")
    journal = Service("journal", ["sh", "-c", "sleep 60"], tmp_path, {"PATH": os.environ["PATH"]}, tmp_path / "server.log")
    supervisor = Supervisor(terminal, inbox, Services(journal), stdin=os.open(os.devnull, os.O_RDONLY), stdout=os.open(os.devnull, os.O_WRONLY))
    inbox.open()
    terminal.start()
    stopping = threading.Event()

    def turn() -> None:
        while not stopping.is_set():
            supervisor.relay_once(0.05)
            supervisor.services.keep_alive()
    loop = threading.Thread(target=turn, daemon=True)
    loop.start()
    try:
        folder = tmp_path / "echo"
        shutil.copytree(Path(__file__).parent / "plugins" / "echo", folder)
        manifest = json.loads((folder / "journal-plugin.json").read_text())
        (folder / "journal-plugin.json").write_text(json.dumps({**manifest, "services": [*manifest["services"], {"name": "never", "command": ["./serve.py"], "when": "false"}]}))
        app.console().run(["plugin", "install", str(folder), "--yes"], USER)
        listening = app.container.get(PluginFolders).socket(app.container.get(Plugins).lookup("echo"), "main")
        until = time.time() + 10
        while not listening.is_socket() and time.time() < until:
            time.sleep(0.1)
        assert listening.is_socket(), "the supervisor started the plugin's service"
        names = [p["name"] for p in supervisor.described()]
        assert "plugin.echo.serve" in names and "plugin.echo.never" not in names, "a service starts only where its when check passes"
        hook(app, "SessionStart")
        status, body = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})
        assert status == 409 and "echo refuses a forbidden tool through its service" in body["error"], "the held event was answered by the service"
        app.console().run(["plugin", "disable", "echo"], USER)
        until = time.time() + 5
        while any(p["name"] == "plugin.echo.serve" and p.get("running") for p in supervisor.described()) and time.time() < until:
            time.sleep(0.1)
        assert not any(p["name"] == "plugin.echo.serve" and p.get("running") for p in supervisor.described()), "turning it off stops its service"
        app.console().run(["plugin", "enable", "echo"], USER)
    finally:
        stopping.set()
        loop.join()
        supervisor.stop()
        supervisor.services.stop_all()
        inbox.close()
    status, body = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "forbidden.py"})
    assert status == 409 and "through its service" not in body["error"], "with the service gone, the program answers"
