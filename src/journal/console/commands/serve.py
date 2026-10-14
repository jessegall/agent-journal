from argparse import ArgumentParser, Namespace

from journal.console.command import Command
from journal.http.server import Server


class ServeCommand(Command):
    """journal serve: what the supervisor starts and keeps alive."""

    noun = "serve"

    def __init__(self, server: Server) -> None: ...

    def arguments(self, parser: ArgumentParser) -> None: ...

    def run(self, args: Namespace) -> int: ...
