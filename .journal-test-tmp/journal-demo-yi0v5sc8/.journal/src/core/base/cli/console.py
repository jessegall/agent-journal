import io
from contextlib import redirect_stderr, redirect_stdout
from typing import TextIO

from core.base.caller.caller_request import CallerRequest
from core.base.caller.caller_resolver import CallerResolver
from core.base.caller.caller import Caller
from core.base.change.event_log import EventLog
from core.base.change.touched_rows import TouchedRows
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.base.cli.line_parser import LineParser
from core.base.cli.shell_aliases import ShellAliases
from core.base.cli.shell_handoff import ShellHandoff
from core.base.cli.usage_error import UsageError
from core.base.cli.write_flags import WriteFlags
from core.base.command.bus import Bus
from core.base.deadline_passed_error import DeadlinePassedError
from core.base.environment_names import EnvironmentNames
from core.base.error_log import ErrorLog
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.model.tables import Tables
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.module_finder import ModuleFinder
from core.base.registry.registry import Registry
from core.base.registry.stale_registry_error import StaleRegistryError
from core.base.refusal import Refusal
from core.base.refusal_log import RefusalLog
from core.base.scope.scopes import Scopes

SUCCESS_CODE, REFUSED_CODE, USAGE_CODE, ERROR_CODE = 0, 1, 2, 3
HELP_FLAGS = ("--help", "-h")


class Console:
    """Runs one `journal <model> <subcommand>`, or the shell line an alias names: checks the registry is
    current, chooses the subcommand, reads or runs its command, and converts a refusal, a usage error or
    an unexpected error into its line and exit code. A write runs the commit listeners before and after
    it; an error after the commit is logged and never changes the exit code of a write that was saved."""

    def __init__(self, registry: Registry, finder: ModuleFinder, fingerprint: CodeFingerprint, line_parser: LineParser, bus: Bus,
                 flags: WriteFlags, refusals: RefusalLog, errors: ErrorLog, tables: Tables, commit_listeners: CommitListenerRunner,
                 environment_names: EnvironmentNames, resolver: CallerResolver, aliases: ShellAliases, handoff: ShellHandoff, events: EventLog, scopes: Scopes) -> None:
        self.registry, self.finder, self.fingerprint, self.line_parser, self.bus = registry, finder, fingerprint, line_parser, bus
        self.flags, self.refusals, self.errors, self.tables, self.commit_listeners = flags, refusals, errors, tables, commit_listeners
        self.environment_names, self.resolver, self.aliases, self.handoff, self.events, self.scopes = environment_names, resolver, aliases, handoff, events, scopes

    def run(self, argv: list[str], caller: Caller, stream: TextIO, request: CallerRequest = CallerRequest()) -> int:
        output = Output(self.tables, "--json" in argv, stream)
        try:
            self.registry.require_current(self.fingerprint.text(self.finder.modules()))
            shell_run = self.aliases.shell_run(argv, caller, request)
            if shell_run is not None:
                return self.handoff.run(shell_run, stream)
            if not argv or argv[0] in HELP_FLAGS:
                return self.help_line_count("the journal's commands; journal <name> --help lists one's subcommands", self.line_parser.lookup.cli_names(), stream)
            subcommand_omitted = len(argv) == 1 or (argv[1].startswith("-") and argv[1] not in HELP_FLAGS)
            if subcommand_omitted and f"{argv[0]} {argv[0]}" in self.registry.subcommands:
                return self.chosen_run([argv[0], *argv], caller, output)
            if len(argv) == 1 or argv[1] in HELP_FLAGS:
                return self.subcommand_help(argv[0], stream)
            return self.chosen_run(argv, caller, output)
        except (UsageError, StaleRegistryError) as error:
            output.error(str(error))
            return USAGE_CODE
        except DeadlinePassedError as error:
            output.error(str(error))
            return ERROR_CODE
        except Refusal as refusal:
            self.refusals.record(caller.actor, " ".join(argv[:2]), refusal)
            output.refusal(refusal)
            return REFUSED_CODE
        except BrokenPipeError:
            return ERROR_CODE
        except Exception as error:
            output.error(self.errors.reported(argv, error, caller.environment_id))
            return ERROR_CODE

    def subcommand_help(self, cli_name: str, stream: TextIO) -> int:
        names = self.line_parser.lookup.names(cli_name)
        if not names:
            raise UsageError(f"journal has no {cli_name} commands: journal --help lists them")
        return self.help_line_count(f"journal {cli_name}; journal {cli_name} <subcommand> --help shows its flags", names, stream)

    def help_line_count(self, heading: str, names: list[str], stream: TextIO) -> int:
        stream.write("\n".join([heading, *(f"  {name}" for name in names)]) + "\n")
        return SUCCESS_CODE

    def requested_run(self, argv: list[str], request: CallerRequest, stream: TextIO) -> int:
        try:
            caller = self.resolver.caller(request)
        except UsageError as error:
            Output(self.tables, "--json" in argv, stream).error(str(error))
            return USAGE_CODE
        return self.run(argv, caller, stream, request)

    def chosen_run(self, argv: list[str], caller: Caller, output: Output) -> int:
        subcommand, parser = self.line_parser.parser(argv)
        captured_output = io.StringIO()
        try:
            with redirect_stdout(captured_output), redirect_stderr(captured_output):
                arguments = parser.parse_args(argv[2:])
        except SystemExit as exit_request:
            output.stream.write(captured_output.getvalue())
            return SUCCESS_CODE if exit_request.code == 0 else USAGE_CODE
        if not isinstance(subcommand, Subcommand):
            with self.scopes.read_scope(subcommand.disabled_scopes, caller.read_actor_id):
                value = subcommand.read(arguments, caller)
            subcommand.write_output(value, output)
            return SUCCESS_CODE
        self.commit_listeners.run()
        command, skipped = subcommand.command(arguments, caller), self.flags.skipped_guards(arguments)
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if arguments.explain:
            output.explanation(self.bus.explain(command, caller.actor, skipped, environment_id))
            return SUCCESS_CODE
        newest_event_id = self.events.newest_id()
        value = self.bus.run(command, caller.actor, skipped, environment_id=environment_id)
        actor_events = [event for event in self.events.events_past(newest_event_id) if event.actor_id == caller.actor.id]
        command_timestamps = {event.timestamp for event in actor_events if event.command == command.label()}
        output.confirmation = "\n".join(TouchedRows.built(event for event in actor_events if event.timestamp in command_timestamps).lines())
        subcommand.write_output(value, output)
        self.run_commit_listeners(argv)
        return SUCCESS_CODE

    def run_commit_listeners(self, argv: list[str]) -> None:
        try:
            self.commit_listeners.run()
        except Exception as error:
            self.errors.reported(["after", *argv], error)
