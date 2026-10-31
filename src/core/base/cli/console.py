from typing import TextIO

from core.base.caller.caller_request import CallerRequest
from core.base.caller.caller_resolver import CallerResolver
from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.base.cli.line_parser import LineParser
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

SUCCESS_CODE, REFUSED_CODE, USAGE_CODE, ERROR_CODE = 0, 1, 2, 3


class Console:
    """Runs one `journal <model> <subcommand>`: checks the registry is current, chooses the subcommand,
    reads or runs its command, and converts a refusal, a usage error or an unexpected error into its line
    and exit code. A write runs the commit listeners before and after it; an error after the commit is
    logged and never changes the exit code of a write that was saved."""

    def __init__(self, registry: Registry, finder: ModuleFinder, fingerprint: CodeFingerprint, line_parser: LineParser, bus: Bus,
                 flags: WriteFlags, refusals: RefusalLog, errors: ErrorLog, tables: Tables, commit_listeners: CommitListenerRunner,
                 environment_names: EnvironmentNames, resolver: CallerResolver) -> None:
        self.registry, self.finder, self.fingerprint, self.line_parser, self.bus = registry, finder, fingerprint, line_parser, bus
        self.flags, self.refusals, self.errors, self.tables, self.commit_listeners = flags, refusals, errors, tables, commit_listeners
        self.environment_names, self.resolver = environment_names, resolver

    def run(self, argv: list[str], caller: Caller, stream: TextIO) -> int:
        output = Output(self.tables, "--json" in argv, stream)
        try:
            self.registry.require_current(self.fingerprint.text(self.finder.modules()))
            if len(argv) < 2:
                raise UsageError("write journal <model> <subcommand>; journal --help lists them")
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
        except Exception as error:
            output.error(self.errors.reported(argv, error, caller.environment_id))
            return ERROR_CODE

    def requested_run(self, argv: list[str], request: CallerRequest, stream: TextIO) -> int:
        try:
            caller = self.resolver.caller(request)
        except UsageError as error:
            Output(self.tables, "--json" in argv, stream).error(str(error))
            return USAGE_CODE
        return self.run(argv, caller, stream)

    def chosen_run(self, argv: list[str], caller: Caller, output: Output) -> int:
        subcommand, parser = self.line_parser.parser(argv)
        try:
            arguments = parser.parse_args(argv[2:])
        except SystemExit as exit_request:
            return SUCCESS_CODE if exit_request.code == 0 else USAGE_CODE
        if not isinstance(subcommand, Subcommand):
            subcommand.write_output(subcommand.read(arguments, caller), output)
            return SUCCESS_CODE
        self.commit_listeners.run()
        command, skipped = subcommand.command(arguments, caller), self.flags.skipped_guards(arguments)
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if arguments.explain:
            output.explanation(self.bus.explain(command, caller.actor, skipped, environment_id))
            return SUCCESS_CODE
        subcommand.write_output(self.bus.run(command, caller.actor, skipped, environment_id=environment_id), output)
        self.run_commit_listeners(argv)
        return SUCCESS_CODE

    def run_commit_listeners(self, argv: list[str]) -> None:
        try:
            self.commit_listeners.run()
        except Exception as error:
            self.errors.reported(["after", *argv], error)
