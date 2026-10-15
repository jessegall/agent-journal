import argparse
import contextlib
import io

from journal.console.command import Command
from journal.console.creations import Creations
from journal.console.outcome import Outcome
from journal.features.refused import Refused
from journal.repositories.not_found import NotFound
from journal.console.where import Where
from journal.container import Container



class Console:
    """journal <noun> <verb> ...: finds the command and runs it, wherever the argv came from."""

    def __init__(self, container: Container) -> None:
        self.container = container
        self.commands: dict[str, Command] = {}
        self._parser: argparse.ArgumentParser | None = None

    def add(self, command: type[Command]) -> None:
        self.commands[command.noun] = self.container.get(command)
        self._parser = None

    def parser(self) -> argparse.ArgumentParser:
        if self._parser is None:
            self._parser = argparse.ArgumentParser(prog="journal", exit_on_error=False)
            nouns = self._parser.add_subparsers(dest="noun", required=True)
            for noun, command in self.commands.items():
                verbs = nouns.add_parser(noun).add_subparsers(dest="verb", required=True)
                command.arguments(verbs)
        return self._parser

    def run(self, argv: list[str], where: Where) -> Outcome:
        """Runs one command with its output captured, so the same call serves the terminal and the server."""
        out, err = io.StringIO(), io.StringIO()
        made = Creations.begin()
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            try:
                args = self.parser().parse_args(argv)
                code = self.commands[args.noun].perform(args, where)
            except (argparse.ArgumentError, SystemExit) as refused:
                self.parser().print_usage(err)
                print(refused, file=err)
                code = 2
            except (NotFound, Refused) as refused:
                print(refused, file=err)
                code = 1
        Creations.end()
        if made:
            out.write(Creations.line(made) + "\n")
        return Outcome(code, out.getvalue(), err.getvalue())
