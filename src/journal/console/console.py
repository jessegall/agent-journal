import argparse
import contextlib
import io
import threading

from journal.console.command import Command
from journal.console.creations import Creations
from journal.console.outcome import Outcome
from journal.refused import Refused
from journal.repositories.not_found import NotFound
from journal.console.where import Where
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.container import Container



class Console:
    """journal <noun> <verb> ...: finds the command and runs it, wherever the argv came from."""

    def __init__(self, container: Container) -> None:
        self._capture = threading.Lock()
        self.container = container
        self.commands: dict[str, Command] = {}
        self._parser: argparse.ArgumentParser | None = None

    def add(self, command: type[Command]) -> None:
        self.commands[command.noun] = self.container.get(command)
        self._parser = None

    def attributed(self, where: Where) -> Where:
        """A command from an agent's shell that names no session is the environment's live agent's, wherever the argv came from; with no agent live there, as in a shell outside the journal, it is the user's own."""
        if not where.from_agent_shell or where.session:
            return where
        live = self.container.get(Agents).live(self.container.get(Environments).named(where.environment).id)
        return where.as_(live.session) if live else where

    def parser(self) -> argparse.ArgumentParser:
        if self._parser is None:
            self._parser = argparse.ArgumentParser(prog="journal", exit_on_error=False)
            nouns = self._parser.add_subparsers(dest="noun", required=True)
            for noun, command in self.commands.items():
                verbs = nouns.add_parser(noun).add_subparsers(dest="verb", required=True)
                command.arguments(verbs)
        return self._parser

    def run(self, argv: list[str], where: Where) -> Outcome:
        """Runs one command with its output captured, so the same call serves the terminal and the server. The capture is process-wide, so commands run one at a time."""
        out, err = io.StringIO(), io.StringIO()
        with self._capture:
            return self.captured(argv, where, out, err)

    def captured(self, argv: list[str], where: Where, out: io.StringIO, err: io.StringIO) -> Outcome:
        made = Creations.begin()
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            try:
                args = self.parser().parse_args(argv)
                code = self.commands[args.noun].perform(args, self.attributed(where))
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
