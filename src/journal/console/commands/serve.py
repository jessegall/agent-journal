from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.runtime import Runtime


class ServeCommand(Command):
    """journal serve: the runtime, which is what the supervisor starts and keeps alive."""

    noun = "serve"

    def __init__(self, runtime: Runtime) -> None:
        self.runtime = runtime

    def arguments(self, verbs) -> None:
        self.verb(verbs, "run", "serve until stopped")

    def run(self, args: Namespace, where: Where) -> int:
        self.runtime.run()
        return 0
