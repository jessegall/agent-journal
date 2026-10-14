from argparse import ArgumentParser, Namespace

from journal.console.command import Command
from journal.engine.runtime import Runtime


class ServeCommand(Command):
    """journal serve: the runtime, which is what the supervisor starts and keeps alive."""

    noun = "serve"

    def __init__(self, runtime: Runtime) -> None: ...

    def arguments(self, parser: ArgumentParser) -> None: ...

    def run(self, args: Namespace) -> int: ...
