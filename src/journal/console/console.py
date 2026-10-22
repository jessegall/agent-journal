import argparse
import io
from journal.console.support.chained_line import ChainedLine

from journal.console.support.captured_stream import CapturedStream
from journal.console.command import Command
from journal.console.creations import Creations
from journal.console.support.outcome import Outcome
from journal.console.support.row_verbs import RowVerbs
from journal.support.rejection import Rejection
from journal.support.missing_row import MissingRow
from journal.support.caller import Caller
from journal.support.caller_kind import CallerKind
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope
from journal.container import Container


HELP_FLAGS = ("-h", "--help")


class Console:
    """journal <noun> <verb> ...: finds the command and runs it, wherever the argv came from."""

    def __init__(self, container: Container, environments: Environments, agents: Agents, scope: Scope, row_verbs: RowVerbs) -> None:
        self.container, self.environments, self.agents, self.scope, self.row_verbs = container, environments, agents, scope, row_verbs
        self.commands: dict[str, Command] = {}
        self._parser: argparse.ArgumentParser | None = None

    def add(self, command: type[Command]) -> None:
        self.commands[command.noun] = self.container.get(command)
        self._parser = None

    def attributed(self, caller: Caller) -> Caller:
        if not caller.is_unnamed_agent():
            return caller
        present = self.agents.current()
        return Caller.agent(caller.environment, present.session, present.provider) if present else caller

    def parser(self) -> argparse.ArgumentParser:
        if self._parser is None:
            parser = argparse.ArgumentParser(prog="journal", exit_on_error=False)
            nouns = parser.add_subparsers(dest="noun", required=True)
            for noun, command in self.commands.items():
                verbs = nouns.add_parser(noun).add_subparsers(dest="verb", required=True)
                command.arguments(verbs)
                self.row_verbs.add(noun, verbs)
            self._parser = parser
        return self._parser

    def run(self, argv: list[str], caller: Caller) -> Outcome:
        output, err = io.StringIO(), io.StringIO()
        with self.scope.environment(self.environments.lookup(caller.environment).row_id):
            return self.captured(argv, caller, output, err)

    def with_verb(self, argv: list[str]) -> list[str]:
        command = self.commands.get(argv[0]) if argv else None
        verb = getattr(command, "default_verb", "")
        return [argv[0], verb, *argv[1:]] if verb and not (argv[1:] and argv[1] in {*self.verbs(command), *HELP_FLAGS}) else argv

    @staticmethod
    def switched(argv: list[str]) -> list[str]:
        return [argv[0], argv[2], argv[1], *argv[3:]] if len(argv) > 2 and argv[1].isdigit() else argv

    def verbs(self, command) -> set[str]:
        verbs = argparse.ArgumentParser().add_subparsers()
        command.arguments(verbs)
        return set(verbs.choices) | self.row_verbs.build(command.noun)

    def perform(self, args: argparse.Namespace, caller: Caller) -> int:
        if not self.commands[args.noun].admits(args.verb, caller.kind):
            raise Rejection(self.refusal(args, caller.kind))
        if self.row_verbs.has(args.noun, args.verb):
            return self.row_verbs.perform(args, caller)
        command = self.commands[args.noun]
        code = command.perform(args, caller)
        for line in command.chained(args, caller):
            print(f"\n{line.heading()}\n{self.chained_text(line, caller)}")
        return code

    def refusal(self, args: argparse.Namespace, kind: CallerKind) -> str:
        allowed = [f"journal {noun} {verb}" for noun, command in sorted(self.commands.items()) for verb, kinds in sorted(command.callers.items()) if kind in kinds]
        return f"a {kind} may not run journal {args.noun} {args.verb}; a {kind} may run {', '.join(allowed) or 'no journal command'}"

    def chained_text(self, line: ChainedLine, caller: Caller) -> str:
        if not line.argv:
            return line.absent
        outcome = self.run(list(line.argv), caller)
        return (outcome.text or outcome.error).rstrip() or "nothing"

    @staticmethod
    def exit_status(ended: SystemExit) -> int:
        if isinstance(ended.code, int):
            return ended.code
        return 0 if ended.code is None else 1

    def captured(self, argv: list[str], caller: Caller, output: io.StringIO, err: io.StringIO) -> Outcome:
        argv = self.with_verb(self.switched(argv))
        produced = Creations.begin()
        with CapturedStream.capture(output, err):
            try:
                args = self.parser().parse_args(argv)
                code = self.perform(args, self.attributed(caller))
            except argparse.ArgumentError as refused:
                self.parser().print_usage(err)
                print(refused, file=err)
                code = 2
            except SystemExit as ended:
                code = self.exit_status(ended)
            except (MissingRow, Rejection) as refused:
                print(refused, file=err)
                code = 1
        Creations.end()
        trailer = Creations.line(produced, output.getvalue()) if produced else ""
        if trailer:
            output.write(trailer + "\n")
        return Outcome(code, output.getvalue(), err.getvalue())
