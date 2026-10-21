import argparse
import io

from journal.console.support.captured_stream import CapturedStream
from journal.console.command import Command
from journal.console.creations import Creations
from journal.console.support.outcome import Outcome
from journal.console.support.row_verbs import RowVerbs
from journal.support.refused import Refused
from journal.support.not_found import NotFound
from journal.support.where import Where
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.support.scope import Scope
from journal.container import Container



class Console:
    """journal <noun> <verb> ...: finds the command and runs it, wherever the argv came from."""

    def __init__(self, container: Container, environments: Environments, agents: Agents, scope: Scope, row_verbs: RowVerbs) -> None:
        self.container, self.environments, self.agents, self.scope, self.row_verbs = container, environments, agents, scope, row_verbs
        self.commands: dict[str, Command] = {}
        self._parser: argparse.ArgumentParser | None = None

    def add(self, command: type[Command]) -> None:
        self.commands[command.noun] = self.container.get(command)
        self._parser = None

    def attributed(self, where: Where) -> Where:
        """A command from an agent's shell that names no session is the environment's live agent's, wherever the argv came from; with no agent live there, as in a shell outside the journal, it is the user's own."""
        if not where.from_agent_shell or where.session:
            return where
        live = self.agents.live()
        return where.as_(live.session) if live else where

    def parser(self) -> argparse.ArgumentParser:
        """Built whole before it is kept, so a command on another thread never parses with one half made."""
        if self._parser is None:
            parser = argparse.ArgumentParser(prog="journal", exit_on_error=False)
            nouns = parser.add_subparsers(dest="noun", required=True)
            for noun, command in self.commands.items():
                verbs = nouns.add_parser(noun).add_subparsers(dest="verb", required=True)
                command.arguments(verbs)
                self.row_verbs.add(noun, verbs)
            self._parser = parser
        return self._parser

    def run(self, argv: list[str], where: Where) -> Outcome:
        """Runs one command with its output captured, in the environment it names, so the same call serves the terminal and the server; commands on several threads run side by side."""
        out, err = io.StringIO(), io.StringIO()
        with self.scope.of(self.environments.named(where.environment).id):
            return self.captured(argv, where, out, err)

    def with_verb(self, argv: list[str]) -> list[str]:
        """A noun with a default verb takes it when the line names none."""
        command = self.commands.get(argv[0]) if argv else None
        verb = getattr(command, "default_verb", "")
        return [argv[0], verb, *argv[1:]] if verb and not (argv[1:] and argv[1] in self.verbs_of(command)) else argv

    @staticmethod
    def turned(argv: list[str]) -> list[str]:
        return [argv[0], argv[2], argv[1], *argv[3:]] if len(argv) > 2 and argv[1].isdigit() else argv

    def verbs_of(self, command) -> set[str]:
        verbs = argparse.ArgumentParser().add_subparsers()
        command.arguments(verbs)
        return set(verbs.choices) | self.row_verbs.of(command.noun)

    def perform(self, args: argparse.Namespace, where: Where) -> int:
        if self.row_verbs.has(args.noun, args.verb):
            return self.row_verbs.perform(args, where)
        return self.commands[args.noun].perform(args, where)

    def captured(self, argv: list[str], where: Where, out: io.StringIO, err: io.StringIO) -> Outcome:
        argv = self.with_verb(self.turned(argv))
        made = Creations.begin()
        with CapturedStream.into(out, err):
            try:
                args = self.parser().parse_args(argv)
                code = self.perform(args, self.attributed(where))
            except argparse.ArgumentError as refused:
                self.parser().print_usage(err)
                print(refused, file=err)
                code = 2
            except SystemExit as ended:
                code = ended.code
            except (NotFound, Refused) as refused:
                print(refused, file=err)
                code = 1
        Creations.end()
        trailer = Creations.line(made, out.getvalue()) if made else ""
        if trailer:
            out.write(trailer + "\n")
        return Outcome(code, out.getvalue(), err.getvalue())
