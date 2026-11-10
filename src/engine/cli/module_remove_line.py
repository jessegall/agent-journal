from argparse import ArgumentParser
from typing import TextIO

from engine.enums.actor_type import ActorType
from engine.caller.caller_request import CallerRequest
from engine.caller.caller import Caller
from engine.caller.caller_resolver import CallerResolver
from engine.cli.console import Console, REFUSED_CODE, SUCCESS_CODE, USAGE_CODE
from engine.cli.errors.usage_error import UsageError
from engine.cli.write_flags import WriteFlags
from engine.database.database import Database
from engine.container.journal_container import synced_container
from engine.journal.journal_home import JournalHome
from engine.model.tables import Tables
from engine.module.errors.module_error import ModuleError
from engine.module.module_removal import ModuleRemoval
from engine.errors.refusal import Refusal
from engine.errors.user_approval_refusal import UserApprovalRefusal
from engine.subcommand.output import Output

MODULE_REMOVAL_ARGUMENTS = ["module", "remove"]


class ModuleRemoveLine:
    """Removes an installed module for a person and runs cleanup against the updated registry."""

    def __init__(self, removal: ModuleRemoval, resolver: CallerResolver, tables: Tables, home: JournalHome, console: Console) -> None:
        self.removal, self.resolver, self.tables, self.home = removal, resolver, tables, home
        self.console = console

    def run(self, argv: list[str], request: CallerRequest, stream: TextIO) -> int:
        try:
            caller = self.resolver.caller(request)
        except UsageError as error:
            Output(self.tables, "--json" in argv, stream).error(str(error))
            return USAGE_CODE
        return self.run_as(argv, caller, stream)

    def run_as(self, argv: list[str], caller: Caller, stream: TextIO) -> int:
        parser = ArgumentParser(prog="journal module remove")
        parser.add_argument("name")
        parser.add_argument("--json", action="store_true")
        WriteFlags.declare_reason_flag(parser)
        try:
            arguments = parser.parse_args(argv[2:])
        except SystemExit as error:
            return USAGE_CODE if error.code else SUCCESS_CODE
        output = Output(self.tables, arguments.json, stream)
        try:
            if caller.actor.type is ActorType.AGENT:
                raise UserApprovalRefusal(f"Remove the module {arguments.name}?", WriteFlags.without_reason(argv))
            if caller.actor.type is not ActorType.USER:
                raise Refusal("module removal requires a person")
            self.removal.remove(arguments.name)
        except UsageError as error:
            output.error(str(error))
            return USAGE_CODE
        except ModuleError as error:
            output.error(str(error))
            return REFUSED_CODE
        except Refusal as refusal:
            self.console.request_approval(refusal, argv, caller, arguments)
            output.refusal(refusal)
            return REFUSED_CODE
        container = synced_container(self.home)
        try:
            container.get(Console).run_commit_listeners(argv)
        finally:
            container.get(Database).close()
        output.write(f"removed module {arguments.name}", {"module": arguments.name})
        return SUCCESS_CODE
