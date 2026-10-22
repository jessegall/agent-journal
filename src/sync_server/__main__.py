import argparse
from pathlib import Path

from sync_server.team_server import TeamServer


def main() -> None:
    parser = argparse.ArgumentParser(prog="sync_server", description="the team server of a shared journal")
    parser.add_argument("--data", type=Path, required=True, help="the folder its database lives in")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8470)
    arguments = parser.parse_args()
    arguments.data.mkdir(parents=True, exist_ok=True)
    TeamServer(arguments.data).http(arguments.host, arguments.port).serve_forever()


main()
