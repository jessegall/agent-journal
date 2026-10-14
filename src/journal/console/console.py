from journal.console.command import Command
from journal.container import Container


class Console:
    """journal <noun> <verb> ...: finds the command and runs it."""

    def __init__(self, container: Container) -> None: ...

    def add(self, command: type[Command]) -> None: ...

    def run(self, argv: list[str]) -> int: ...
