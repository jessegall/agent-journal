import argparse

from journal.console.command import Command
from journal.console.where import Where
from journal.container import Container


class Console:
    """journal <noun> <verb> ...: finds the command and runs it."""

    def __init__(self, container: Container, where: Where) -> None:
        self.container, self.where = container, where
        self.commands: dict[str, Command] = {}

    def add(self, command: type[Command]) -> None:
        self.commands[command.noun] = self.container.get(command)

    def parser(self) -> argparse.ArgumentParser:
        parser = argparse.ArgumentParser(prog="journal")
        nouns = parser.add_subparsers(dest="noun", required=True)
        for noun, command in self.commands.items():
            verbs = nouns.add_parser(noun).add_subparsers(dest="verb", required=True)
            command.arguments(verbs)
        return parser

    def run(self, argv: list[str]) -> int:
        args = self.parser().parse_args(argv)
        return self.commands[args.noun].run(args, self.where.actor())
