import argparse
import json
import sys
import time
from pathlib import Path

from sync_server.refusal import Refusal
from sync_server.setup_answers import SetupAnswers
from sync_server.team_server import TeamServer
from sync_server.team_setup import TeamSetup


def main() -> None:
    parser = argparse.ArgumentParser(prog="sync_server", description="the team server of a shared journal")
    verbs = parser.add_subparsers(dest="verb", required=True)
    serve = verbs.add_parser("serve", help="answer the team's journals")
    serve.add_argument("--data", type=Path, required=True, help="the folder its database lives in")
    serve.add_argument("--host", default="127.0.0.1")
    serve.add_argument("--port", type=int, default=8470)
    setup = verbs.add_parser("setup", help="make the admin's account and print a join code; the answers come as JSON on standard input, so the password is never on a command line")
    setup.add_argument("--data", type=Path, required=True)
    arguments = parser.parse_args()
    arguments.data.mkdir(parents=True, exist_ok=True)
    team = TeamServer(arguments.data)
    if arguments.verb == "serve":
        team.http(arguments.host, arguments.port).serve_forever()
        return
    answers = SetupAnswers(**json.loads(sys.stdin.read()))
    try:
        print(TeamSetup(team).create(answers.name, answers.email, answers.password, answers.password_repeat, time.time()))
    except Refusal as refused:
        print(refused, file=sys.stderr)
        sys.exit(1)


main()
