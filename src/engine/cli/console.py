import io
from argparse import Namespace
from dataclasses import replace
from contextlib import redirect_stderr, redirect_stdout
from typing import TextIO

from engine.caller.caller_request import CallerRequest
from engine.caller.caller_resolver import CallerResolver
from engine.caller.caller import Caller
from engine.event.event_log import EventLog
from engine.event.touched_rows import TouchedRows
from engine.subcommand.output import Output
from engine.subcommand.overview_command import OverviewCommand
from engine.subcommand.overview_reads import OverviewReads
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.subcommand.subcommand import Subcommand
from engine.cli.agent_number_arguments import AgentNumberArguments
from engine.cli.line_parser import LineParser
from engine.cli.subcommand_lookup import AnySubcommand
from engine.cli.shell_aliases import ShellAliases
from engine.cli.shell_handoff import ShellHandoff
from engine.cli.errors.usage_error import UsageError
from engine.cli.write_flags import WriteFlags
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.check_approval_works import CheckApprovalWorks
from engine.command.accept_covered_approval import AcceptCoveredApproval
from engine.command.request_user_approval import RequestUserApproval
from engine.command.errors.server_stopping_error import ServerStoppingError
from engine.errors.deadline_passed_error import DeadlinePassedError
from engine.environment.environment_names import EnvironmentNames
from engine.log.error_log import ErrorLog
from engine.listener.commit_listener_runner import CommitListenerRunner
from engine.model.tables import Tables
from engine.module.code_fingerprint import CodeFingerprint
from engine.module.module_finder import ModuleFinder
from engine.registry.registry import Registry
from engine.cli.read_limit_bypass import ReadLimitBypass
from engine.driver.refusal_skips import RefusalSkips
from engine.errors.read_limit_error import ReadLimitError
from engine.registry.errors.stale_registry_error import StaleRegistryError
from engine.errors.refusal import Refusal
from engine.log.refusal_log import RefusalLog
from engine.scope.scopes import Scopes
from engine.errors.user_approval_refusal import UserApprovalRefusal

SUCCESS_CODE, REFUSED_CODE, USAGE_CODE, ERROR_CODE = 0, 1, 2, 3
HELP_FLAGS = ("--help", "-h")


class Console:
    """Runs one `journal <model> <subcommand>`, or the shell line an alias names: checks the registry is
    current, chooses the subcommand, reads or runs its command, and converts a refusal, a usage error or
    an unexpected error into its line and exit code. A write runs the commit listeners before and after
    it; an error after the commit is logged and never changes the exit code of a write that was saved."""

    def __init__(self, registry: Registry, finder: ModuleFinder, fingerprint: CodeFingerprint, line_parser: LineParser, bus: Bus,
                 flags: WriteFlags, refusals: RefusalLog, errors: ErrorLog, tables: Tables, commit_listeners: CommitListenerRunner,
                 environment_names: EnvironmentNames, resolver: CallerResolver, aliases: ShellAliases, handoff: ShellHandoff, events: EventLog, scopes: Scopes, refusal_skips: RefusalSkips, overview_reads: OverviewReads, read_limit_bypass: ReadLimitBypass, agent_numbers: AgentNumberArguments) -> None:
        self.read_limit_bypass, self.agent_numbers = read_limit_bypass, agent_numbers
        self.registry, self.finder, self.fingerprint, self.line_parser, self.bus = registry, finder, fingerprint, line_parser, bus
        self.flags, self.refusals, self.errors, self.tables, self.commit_listeners = flags, refusals, errors, tables, commit_listeners
        self.refusal_skips, self.overview_reads = refusal_skips, overview_reads
        self.environment_names, self.resolver, self.aliases, self.handoff, self.events, self.scopes = environment_names, resolver, aliases, handoff, events, scopes

    def run(self, argv: list[str], caller: Caller, stream: TextIO, request: CallerRequest = CallerRequest()) -> int:
        output = Output(self.tables, "--json" in argv, stream)
        try:
            argv = self.read_limit_bypass.applied(argv, caller)
            self.registry.require_current(self.fingerprint.text(self.finder.modules()))
            shell_run = self.aliases.shell_run(argv, caller, request)
            if shell_run is not None:
                return self.handoff.run(shell_run, stream)
            if not argv or argv[0] in HELP_FLAGS:
                return self.help_line_count("the journal's commands; journal <name> --help lists one's subcommands", self.line_parser.lookup.cli_names(), stream)
            subcommand_omitted = len(argv) == 1 or (argv[1].startswith("-") and argv[1] not in HELP_FLAGS)
            if subcommand_omitted and f"{argv[0]} {argv[0]}" in self.registry.subcommands:
                return self.run_parsed([argv[0], *argv], caller, output)
            if len(argv) == 1 or argv[1] in HELP_FLAGS:
                return self.subcommand_help(argv[0], stream)
            return self.run_parsed(argv, caller, output)
        except (UsageError, StaleRegistryError) as error:
            output.error(str(error))
            return USAGE_CODE
        except (DeadlinePassedError, ServerStoppingError) as error:
            output.error(str(error))
            return ERROR_CODE
        except Refusal as refusal:
            self.refusals.record(caller.actor, " ".join(argv[:2]), refusal)
            output.refusal(refusal)
            return refusal.exit_code
        except BrokenPipeError:
            return ERROR_CODE
        except ReadLimitError as error:
            self.errors.reported(argv, error, caller.environment_id)
            refusal = self.read_limit_bypass.refusal(error, caller)
            output.refusal(refusal)
            return refusal.exit_code
        except Exception as error:
            output.error(self.errors.reported(argv, error, caller.environment_id))
            return ERROR_CODE

    def request_approval(self, refusal: Refusal, argv: list[str], caller: Caller, parsed: Namespace) -> str | None:
        approval = refusal.original
        if not isinstance(approval, UserApprovalRefusal):
            return None
        line = WriteFlags.without_reason(argv) if getattr(parsed, "reason_flag_added", False) else tuple(argv)
        why = getattr(parsed, "reason", "")
        arguments = approval.arguments or (() if approval.command is not None else line)
        self.bus.run(CheckApprovalWorks(approval, arguments), caller.actor, environment_id=caller.environment_id)
        self.bus.run(RequestUserApproval(approval, arguments, why=why), caller.actor, environment_id=caller.environment_id)
        try:
            return self.bus.run(AcceptCoveredApproval(), caller.actor, environment_id=caller.environment_id)
        finally:
            self.run_commit_listeners(argv)

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
            caller = replace(self.resolver.caller(request), process_id=request.process_id)
        except UsageError as error:
            Output(self.tables, "--json" in argv, stream).error(str(error))
            return USAGE_CODE
        return self.run(argv, caller, stream, request)

    def run_parsed(self, argv: list[str], caller: Caller, output: Output) -> int:
        subcommand, parser = self.line_parser.parser(argv)
        captured_output = io.StringIO()
        try:
            with redirect_stdout(captured_output), redirect_stderr(captured_output):
                arguments = parser.parse_args(argv[2:])
        except SystemExit as exit_request:
            output.stream.write(captured_output.getvalue())
            return SUCCESS_CODE if exit_request.code == 0 else USAGE_CODE
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        self.scopes.check_environment(caller.actor, environment_id)
        environment_id = self.scopes.line_environment_id(caller.actor, environment_id)
        self.agent_numbers.replace_numbers(arguments, environment_id)
        caller = replace(caller, environment_id=environment_id)
        try:
            return self.parsed_run(argv, subcommand, arguments, caller, output)
        except Refusal as refusal:
            accepted = self.request_approval(refusal, argv, caller, arguments)
            if accepted is None:
                raise
            output.write(accepted, {"accepted": accepted})
            return SUCCESS_CODE

    def parsed_run(self, argv: list[str], subcommand: AnySubcommand, arguments: Namespace,
                   caller: Caller, output: Output) -> int:
        environment_id = caller.environment_id
        if not isinstance(subcommand, Subcommand):
            self.check_overview(subcommand, arguments, caller)
            with self.scopes.read_scope(subcommand.disabled_scopes, caller.read_actor_id, environment_id):
                value = subcommand.read(arguments, self.scoped_caller(subcommand, caller))
            subcommand.write_output(value, output)
            self.note_overview(subcommand, arguments, caller)
            return SUCCESS_CODE
        self.commit_listeners.run()
        command, skipped = subcommand.command(arguments, caller), self.flags.skipped_guards(arguments)
        if arguments.explain:
            output.explanation(self.bus.explain(command, caller.actor, skipped, environment_id))
            return SUCCESS_CODE
        self.refusal_skips.check_guards(caller.actor, sorted(skipped), arguments.skip_reason)
        self.check_overview(subcommand, arguments, caller)
        newest_event_id = self.events.newest_id()
        value = self.bus.run(command, caller.actor, skipped, environment_id=environment_id, plugin_script=caller.plugin_script)
        actor_events = [event for event in self.events.events_after(newest_event_id) if event.actor_id == caller.actor.id]
        command_timestamps = {event.timestamp for event in actor_events if event.command == command.label()}
        output.confirmation = "\n".join(TouchedRows.built(event for event in actor_events if event.timestamp in command_timestamps).lines())
        with self.scopes.read_scope(subcommand.disabled_scopes, caller.read_actor_id, environment_id):
            subcommand.write_output(value, output)
        self.note_overview(subcommand, arguments, caller)
        self.run_commit_listeners(argv)
        with self.scopes.read_scope(subcommand.disabled_scopes, caller.read_actor_id, environment_id):
            subcommand.after_listeners(value, output)
        return SUCCESS_CODE

    def check_overview(self, subcommand: AnySubcommand, arguments: Namespace, caller: Caller) -> None:
        if isinstance(subcommand, OverviewCommand):
            self.overview_reads.check(caller.actor, f"{subcommand.cli_name} {subcommand.name}", subcommand.overview_target(arguments), subcommand.is_read_required(arguments, caller))

    def note_overview(self, subcommand: AnySubcommand, arguments: Namespace, caller: Caller) -> None:
        if isinstance(subcommand, OverviewCommand):
            self.overview_reads.note(caller.actor, f"{subcommand.cli_name} {subcommand.name}", subcommand.overview_target(arguments))

    def dispatched(self, argv: list[str], caller: Caller, context: Context) -> object:
        subcommand, parser = self.line_parser.parser(argv)
        captured_output = io.StringIO()
        try:
            with redirect_stdout(captured_output), redirect_stderr(captured_output):
                arguments = parser.parse_args(argv[2:])
        except SystemExit:
            raise UsageError(f"journal {' '.join(argv)} does not parse: {captured_output.getvalue().strip()}") from None
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        self.scopes.check_environment(caller.actor, environment_id)
        environment_id = self.scopes.line_environment_id(caller.actor, environment_id)
        self.agent_numbers.replace_numbers(arguments, environment_id)
        if not isinstance(subcommand, Subcommand):
            raise Refusal(f"journal {' '.join(argv[:2])} only reads, so it has no place in a transaction")
        command = subcommand.command(arguments, replace(caller, environment_id=environment_id))
        handler = self.bus.handler(command)
        if handler.has_prepare_step:
            raise Refusal(f"journal {' '.join(argv[:2])} works outside the database, so it cannot run inside a transaction")
        with self.scopes.command_scope(handler.disabled_scopes, caller.actor, environment_id):
            return self.bus.dispatch(command, replace(context, actor=caller.actor, environment_id=environment_id))

    def scoped_caller(self, subcommand: ReadSubcommand[object], caller: Caller) -> Caller:
        environment_id = self.scopes.environment_id or caller.environment_id
        if subcommand.environment_refusal and environment_id is None:
            raise Refusal(subcommand.environment_refusal, "name it with --environment")
        return replace(caller, environment_id=environment_id)

    def run_commit_listeners(self, argv: list[str]) -> None:
        try:
            self.commit_listeners.run()
        except Exception as error:
            self.errors.reported(["after", *argv], error)
