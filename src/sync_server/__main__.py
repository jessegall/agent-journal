import argparse
import json
from dataclasses import asdict
import sys
import time
from pathlib import Path

from sync_server.db.store import Store
from sync_server.hosted_invitation import HostedInvitation
from sync_server.refusal import Refusal
from sync_server.setup_answers import SetupAnswers
from sync_server.team_server import BACKUPS, DATABASE, TeamServer
from sync_server.team_setup import TeamSetup



def serve(arguments: argparse.Namespace) -> None:
    TeamServer(arguments.data).http(arguments.host, arguments.port).serve_forever()


def setup(arguments: argparse.Namespace) -> None:
    answers = SetupAnswers(**json.loads(sys.stdin.read()))
    try:
        print(TeamSetup(TeamServer(arguments.data)).create(answers.name, answers.email, answers.password, answers.password_repeat, time.time()))
    except Refusal as refused:
        print(refused, file=sys.stderr)
        sys.exit(1)


def backup(arguments: argparse.Namespace) -> None:
    target = arguments.to or arguments.data / BACKUPS / time.strftime("team-%Y%m%d-%H%M%S.db")
    target.parent.mkdir(parents=True, exist_ok=True)
    Store(arguments.data / DATABASE).backup(target)
    print(target)


def restore(arguments: argparse.Namespace) -> None:
    if not arguments.source.is_file():
        print(f"no backup at {arguments.source}", file=sys.stderr)
        sys.exit(1)
    Store(arguments.data / DATABASE).restore(arguments.source)
    print(f"restored {arguments.source} into {arguments.data / DATABASE}")


def hosted(arguments: argparse.Namespace) -> None:
    print(json.dumps(asdict(HostedInvitation(arguments.data).issued())))


VERBS = {"serve": serve, "setup": setup, "backup": backup, "restore": restore, "hosted": hosted}


def main() -> None:
    parser = argparse.ArgumentParser(prog="sync_server", description="the team server of a shared journal")
    verbs = parser.add_subparsers(dest="verb", required=True)
    serving = verbs.add_parser("serve", help="answer the team's journals; its own migrations run first, so a new image upgrades the database at its first start")
    serving.add_argument("--host", default="127.0.0.1")
    serving.add_argument("--port", type=int, default=8470)
    verbs.add_parser("setup", help="make the admin's account and print a join code; the answers come as JSON on standard input, so the password is never on a command line")
    backing = verbs.add_parser("backup", help="copy the database while the server runs, with SQLite's online backup, into the data folder's backups or --to")
    backing.add_argument("--to", type=Path)
    restoring = verbs.add_parser("restore", help="put a backup in place of the database; run it while no server runs on the data folder")
    restoring.add_argument("--from", dest="source", type=Path, required=True)
    verbs.add_parser("hosted", help="wait until the team holds a journal, then print, as JSON, the invitation, name and password the server's own hosted journal joins with, and the team's version")
    for verb in verbs.choices.values():
        verb.add_argument("--data", type=Path, required=True, help="the folder its database lives in")
    arguments = parser.parse_args()
    arguments.data.mkdir(parents=True, exist_ok=True)
    VERBS[arguments.verb](arguments)


main()
