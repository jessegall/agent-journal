from argparse import ArgumentParser
from typing import TextIO

from core.base.subcommand.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.base.cli.subcommand_lookup import SubcommandLookup, UsageError
from core.base.cli.write_flags import WriteFlags
from core.base.command.bus import Bus
from core.base.error_log import ErrorLog
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.model.tables import Tables
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.module_finder import ModuleFinder
from core.base.registry.registry import Registry, StaleRegistryError
from core.base.refusal import Refusal
from core.base.refusal_log import RefusalLog

SUCCESS_CODE, REFUSED_CODE, USAGE_CODE, ERROR_CODE = 0, 1, 2, 3


class Console:
    """Runs one `journal <noun> <subcommand>`: checks the registry is current, chooses the subcommand, reads or
    runs its command, and turns a refusal, a usage error or an unexpected error into its line and exit code."""

    def __init__(self, registry: Registry, finder: ModuleFinder, fingerprint: CodeFingerprint, lookup: SubcommandLookup, bus: Bus,
                 flags: WriteFlags, refusals: RefusalLog, errors: ErrorLog, tables: Tables, commit_listeners: CommitListenerRunner) -> None:
        self.registry, self.finder, self.fingerprint, self.lookup, self.bus = registry, finder, fingerprint, lookup, bus
        self.flags, self.refusals, self.errors, self.tables, self.commit_listeners = flags, refusals, errors, tables, commit_listeners

    def run(self, argv: list[str], caller: Caller, stream: TextIO) -> int:
        output = Output(self.tables, "--json" in argv, stream)
        try:
            self.registry.require_current(self.fingerprint.text(self.finder.found()))
            if len(argv) < 2:
                raise UsageError("write journal <noun> <subcommand>; journal --help lists them")
            return self.chosen_run(argv, caller, output)
        except (UsageError, StaleRegistryError) as error:
            output.error(str(error))
            return USAGE_CODE
        except Refusal as refusal:
            self.refusals.record(caller.actor, " ".join(argv[:2]), refusal)
            output.refusal(refusal)
            return REFUSED_CODE
        except Exception as error:
            output.error(self.errors.reported(argv, error))
            return ERROR_CODE

    def chosen_run(self, argv: list[str], caller: Caller, output: Output) -> int:
        subcommand = self.lookup.subcommand(argv[0], argv[1])
        parser = ArgumentParser(prog=f"journal {argv[0]} {argv[1]}", description=subcommand.help)
        parser.add_argument("--json", action="store_true")
        subcommand.arguments(parser)
        if isinstance(subcommand, Subcommand):
            self.flags.add(parser)
        try:
            arguments = parser.parse_args(argv[2:])
        except SystemExit as exit_request:
            return SUCCESS_CODE if exit_request.code == 0 else USAGE_CODE
        self.commit_listeners.run()
        if not isinstance(subcommand, Subcommand):
            subcommand.write_output(subcommand.read(arguments, caller), output)
            return SUCCESS_CODE
        command, skipped = subcommand.command(arguments, caller), self.flags.skipped_guards(arguments)
        if arguments.explain:
            output.explanation(self.bus.explain(command, caller.actor, skipped, caller.environment_id))
            return SUCCESS_CODE
        subcommand.write_output(self.bus.run(command, caller.actor, skipped, environment_id=caller.environment_id), output)
        self.commit_listeners.run()
        return SUCCESS_CODE
