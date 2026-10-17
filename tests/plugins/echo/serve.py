#!/usr/bin/env python3
import json
import os
import socket

from run import answer

path = os.environ["JOURNAL_PLUGIN_SOCKET"]
os.environ["ECHO_VIA"] = " through its service"
if os.path.exists(path):
    os.unlink(path)
os.makedirs(os.path.dirname(path), exist_ok=True)
with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as listening:
    listening.bind(path)
    listening.listen()
    while True:
        link, _ = listening.accept()
        with link:
            line = link.makefile("rb").readline()
            link.sendall((answer(json.loads(line)) + "\n").encode())
