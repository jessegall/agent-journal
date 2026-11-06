import json
from pathlib import Path

SERVICE = """#!/usr/bin/env python3
import json, os, socket, threading


def listening(path):
    if os.path.exists(path):
        os.unlink(path)
    server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    server.bind(path)
    server.listen()
    return server


def health():
    server = listening(os.environ["SAMPLE_HEALTH_SOCKET"])
    while True:
        connection, _ = server.accept()
        connection.makefile().readline()
        state = "down" if os.path.exists(os.path.join(os.environ["JOURNAL_PLUGIN_DATA"], "unwell")) else "up"
        connection.sendall((json.dumps({"health": state, "service": "answers"}) + "\\n").encode())
        connection.close()


threading.Thread(target=health, daemon=True).start()
import subprocess
alive_pipe = os.path.join(os.environ["JOURNAL_PLUGIN_DATA"], "child.alive")
if not os.path.exists(alive_pipe):
    os.mkfifo(alive_pipe)
alive = os.open(alive_pipe, os.O_RDWR)
subprocess.Popen(["sleep", "60"], stdout=alive)
os.close(alive)
server = listening(os.environ["JOURNAL_PLUGIN_SOCKET"])
while True:
    connection, _ = server.accept()
    line = connection.makefile().readline()
    with open(os.path.join(os.environ["JOURNAL_PLUGIN_DATA"], "asked"), "a") as asked:
        asked.write(line)
    answer = {"v": 1, "answer": "refuse", "reason": "the service says no"} if "rm -rf" in line else {"v": 1}
    connection.sendall((json.dumps(answer) + "\\n").encode())
    connection.close()
"""
PROGRAM = "#!/bin/sh\ncat > /dev/null\n"
MANIFEST = {"name": "served", "title": "Served", "version": "1.0.0", "protocol": 1, "program": "run.sh", "hears": ["command_starting", "file_edited"],
            "holds": [{"event": "command_starting", "window_ms": 5000}],
            "services": [{"name": "answers", "command": ["serve.py"], "answers": True, "restart": "always"}],
            "health": {"socket_env": "SAMPLE_HEALTH_SOCKET", "request": "{\"health\": 1}", "answer": "{\"health\": \"up\", \"service\": \"<the service's own name>\"}"}}


def service_plugin_folder(parent: Path) -> Path:
    folder = parent / "served-plugin"
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "journal-plugin.json").write_text(json.dumps(MANIFEST))
    for name, text in (("run.sh", PROGRAM), ("serve.py", SERVICE)):
        (folder / name).write_text(text)
        (folder / name).chmod(0o755)
    return folder
