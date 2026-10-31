import json
from pathlib import Path

SERVICE = """#!/usr/bin/env python3
import json, os, socket
path = os.environ["JOURNAL_PLUGIN_SOCKET"]
if os.path.exists(path):
    os.unlink(path)
server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
server.bind(path)
server.listen()
while True:
    connection, _ = server.accept()
    line = connection.makefile().readline()
    answer = {"v": 1, "answer": "refuse", "reason": "the service says no"} if "rm -rf" in line else {"v": 1}
    connection.sendall((json.dumps(answer) + "\\n").encode())
    connection.close()
"""
PROGRAM = "#!/bin/sh\ncat > /dev/null\n"
MANIFEST = {"name": "served", "title": "Served", "version": "1.0.0", "protocol": 1, "program": "run.sh", "hears": ["command_starting"],
            "holds": [{"event": "command_starting", "window_ms": 5000}],
            "services": [{"name": "answers", "command": ["serve.py"], "answers": True, "restart": "always"}]}


def service_plugin_folder(parent: Path) -> Path:
    folder = parent / "served-plugin"
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "journal-plugin.json").write_text(json.dumps(MANIFEST))
    for name, text in (("run.sh", PROGRAM), ("serve.py", SERVICE)):
        (folder / name).write_text(text)
        (folder / name).chmod(0o755)
    return folder
