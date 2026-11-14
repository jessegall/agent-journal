from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.apply_work_settings.apply_work_settings import ApplyWorkSettings
from suites.coding.support.work_settings import WorkSettings


class ApplyWorkSettingsSubcommand(Subcommand[ApplyWorkSettings, WorkSettings]):
    """`journal work-settings apply --revision <revision> <key>=<value>...`: changes workflow controls together."""

    cli_name = "work-settings"
    name = "apply"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--revision", required=True)
        parser.add_argument("changes", nargs="+")

    def command(self, arguments: Namespace, caller: Caller) -> ApplyWorkSettings:
        pairs = [change.partition("=") for change in arguments.changes]
        if any(not separator or not key for key, separator, _ in pairs):
            raise Refusal("a change is written key=value", "for example journal.suites.coding.auto-mode=off")
        return ApplyWorkSettings(arguments.revision, tuple((key, text) for key, _, text in pairs))
