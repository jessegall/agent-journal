import argparse
from functools import partial
import io
import queue

from journal.console.support.streamed_output import StreamedOutput
from journal.console.support.chained_line import ChainedLine
from journal.console.support.role_verbs import RoleVerbs

from journal.console.support.captured_stream import CapturedStream
from journal.console.command import Command
from journal.console.creations import Creations
from journal.console.support.outcome import Outcome
from journal.console.support.row_verbs import RowVerbs
from journal.support.rejection import Rejection
from journal.support.missing_row import MissingRow
from journal.support.caller import Caller
from journal.console.support.verb_rules import VerbRules
from journal.support.agent_role import AgentRole
from journal.repositories.environments import Environments
from journal.hooks.support.hook_seats import HookSeats
from journal.repositories.scope import Scope
from journal.container import Container
from journal.support.project_shell import ProjectShell


HELP_FLAGS = ("-h", "--help")


class Console:
    """journal <noun> <verb> ...: finds the command and runs it, wherever the argv comes from. run_streamed runs a command whose printed lines a reply streams as they are printed, such as a merge that waits on the plugins."""

    def __init__(self, container: Container, environments: Environments, scope: Scope, row_verbs: RowVerbs, shell: ProjectShell, verb_rules: VerbRules, seats: HookSeats) -> None:
        self.verb_rules, self.seats = verb_rules, seats
        self.container, self.environments, self.scope, self.row_verbs, self.shell = container, environments, scope, row_verbs, shell
        self.commands: dict[str, Command] = {}
        self.helper_commands: dict[AgentRole, dict[str, Command]] = {}
        self._parsers: dict[AgentRole, argparse.ArgumentParser] = {}

    def add(self, command: type[Command]) -> None:
        self.commands[command.noun] = self.container.get(command)
        self._parsers.clear()

    def add_helper(self, role: AgentRole, command: type[Command]) -> None:
        self.helper_commands.setdefault(role, {})[command.noun] = self.container.get(command)
        self._parsers.clear()

    def table(self, role: AgentRole) -> dict[str, Command]:
        return {**self.commands, **self.helper_commands.get(role, {})}

    def build_parsers(self) -> None:
        for role in self.verb_rules.roles():
            self.parser(role)

    def parser(self, role: AgentRole) -> argparse.ArgumentParser:
        if role not in self._parsers:
            self._parsers[role] = self.built(role)
        return self._parsers[role]

    def built(self, role: AgentRole) -> argparse.ArgumentParser:
        parser = argparse.ArgumentParser(prog="journal", exit_on_error=False)
        nouns = parser.add_subparsers(dest="noun", required=True)
        groups = {}
        for noun, command in self.table(role).items():
            groups[noun] = RoleVerbs(nouns.add_parser(noun).add_subparsers(dest="verb", required=True), partial(self.verb_rules.runs_verb, type(command), role=role))
            command.arguments(groups[noun])
            self.row_verbs.add(noun, groups[noun])
        nouns.metavar = "{" + ",".join(noun for noun, verbs in groups.items() if verbs.shown) + "}"
        return parser

    def run(self, argv: list[str], caller: Caller) -> Outcome:
        return self.scoped_run(argv, caller, io.StringIO())

    def run_streamed(self, argv: list[str], caller: Caller, output_queue: queue.Queue) -> Outcome:
        return self.scoped_run(argv, caller, StreamedOutput(output_queue))

    def scoped_run(self, argv: list[str], caller: Caller, output: io.StringIO) -> Outcome:
        environment = self.environments.lookup(caller.environment).row_id
        with self.scope.environment(environment):
            seated = self.seats.caller_seated(caller)
        with self.scope.entered(seated.origin(environment)):
            return self.captured(argv, seated, output, io.StringIO())

    def with_verb(self, argv: list[str], role: AgentRole) -> list[str]:
        command = self.table(role).get(argv[0]) if argv else None
        verb = getattr(command, "default_verb", "")
        return [argv[0], verb, *argv[1:]] if verb and not (argv[1:] and argv[1] in {*self.verbs(command), *HELP_FLAGS}) else argv

    def switched(self, argv: list[str], role: AgentRole) -> list[str]:
        return [argv[0], argv[2], argv[1], *argv[3:]] if self.is_number_first(argv, role) else argv

    def is_number_first(self, argv: list[str], role: AgentRole) -> bool:
        command = self.table(role).get(argv[0]) if argv else None
        return command is not None and len(argv) > 2 and argv[1].isdigit() and argv[2] in self.verbs(command)

    def verbs(self, command) -> set[str]:
        verbs = argparse.ArgumentParser().add_subparsers()
        command.arguments(verbs)
        return set(verbs.choices) | self.row_verbs.build(command.noun)

    def perform(self, args: argparse.Namespace, caller: Caller) -> int:
        command = self.table(caller.role)[args.noun]
        if not self.verb_rules.runs_verb(type(command), args.verb, caller.role):
            raise Rejection(self.refusal(args, caller.role))
        if self.row_verbs.has(args.noun, args.verb):
            return self.row_verbs.perform(args, caller)
        code = command.perform(args, caller)
        for line in command.chained(args, caller):
            print(f"\n{line.heading()}\n{self.chained_text(line, caller)}")
        return code

    def refusal(self, args: argparse.Namespace, role: AgentRole) -> str:
        allowed = self.verb_rules.helper_verbs(role)
        return f"a {role.value} may not run journal {args.noun} {args.verb}: {self.verb_rules.helper_file(role)} names the verbs it runs, {', '.join(allowed) or 'no journal command'}"

    def chained_text(self, line: ChainedLine, caller: Caller) -> str:
        return (self.journal_text(line, caller) if line.is_journal() else self.shell.output(line.text)).rstrip() or "nothing"

    def journal_text(self, line: ChainedLine, caller: Caller) -> str:
        outcome = self.run(line.journal_argv(), caller)
        return outcome.text or outcome.error

    @staticmethod
    def exit_status(ended: SystemExit) -> int:
        if isinstance(ended.code, int):
            return ended.code
        return 0 if ended.code is None else 1

    def captured(self, argv: list[str], caller: Caller, output: io.StringIO, err: io.StringIO) -> Outcome:
        argv = self.with_verb(self.switched(argv, caller.role), caller.role)
        produced = Creations.begin()
        with CapturedStream.capture(output, err):
            try:
                args = self.parser(caller.role).parse_args(argv)
                code = self.perform(args, caller)
            except argparse.ArgumentError as refused:
                self.parser(caller.role).print_usage(err)
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
