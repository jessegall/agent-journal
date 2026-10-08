import argparse
import grp
import os
import pwd
import socket
import subprocess
import sys
import time
from pathlib import Path

import features
from engine import runtime
from engine.record import Record
from features.hosted_journal.feature import APART
from features.sharing.controller import Shares
from features.sharing.server import serve_on
from features.switches import watch_change_log
from resources.base import SYSTEM

USER = "gateway"
GROUP = "journal"
RESTART_SECONDS = 2
PASSED = ("PATH", "PYTHONPATH", "AGENT_JOURNAL_VAULT", "LANG")


def keep(root: Path, host: str, port: int) -> None:
    """As root: binds the login page's port once and holds it, starting the login page as its own user on it again whenever it ends."""
    listening = socket.create_server((host, port))
    user = pwd.getpwnam(USER)
    env = {**{name: os.environ[name] for name in PASSED if name in os.environ},
           "HOME": user.pw_dir, APART: "1", "PYTHONSAFEPATH": "1", "PYTHONDONTWRITEBYTECODE": "1"}
    command = [sys.executable, "-P", "-m", "features.hosted_journal.apart", "serve", str(root), "--fd", str(listening.fileno())]
    while True:
        subprocess.run(command, pass_fds=(listening.fileno(),), user=user.pw_uid, group=grp.getgrnam(GROUP).gr_gid, extra_groups=[],
                       cwd="/", env=env, check=False)
        time.sleep(RESTART_SECONDS)


def serve(root: Path, fd: int) -> None:
    """As the login page's user: answers on the socket the keeper holds, guarded by what only this user can read."""
    features.load(root)
    watch_change_log()
    serve_on(Shares(Record(root, runtime.env(root)), actor=SYSTEM), socket.socket(fileno=fd))


def main(argv: list[str]) -> None:
    parser = argparse.ArgumentParser(prog="apart", description="The login page of a journal on a server, run apart from the journal")
    words = parser.add_subparsers(dest="word", required=True)
    kept = words.add_parser("keep", help="as root: hold the port and keep the login page running on it")
    kept.add_argument("root", type=Path)
    kept.add_argument("--host", default="0.0.0.0")
    kept.add_argument("--port", type=int, default=8440)
    served = words.add_parser("serve", help="as the login page's user: answer on the held port")
    served.add_argument("root", type=Path)
    served.add_argument("--fd", type=int, required=True)
    given = parser.parse_args(argv)
    if given.word == "keep":
        return keep(given.root.resolve(), given.host, given.port)
    return serve(given.root.resolve(), given.fd)


if __name__ == "__main__":
    main(sys.argv[1:])
