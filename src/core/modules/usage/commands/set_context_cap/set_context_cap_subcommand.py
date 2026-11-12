from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.settings.commands.support.current_setting_output import CurrentSettingOutput
from core.modules.settings.support.current_setting import CurrentSetting
from core.modules.usage.commands.set_context_cap.set_context_cap import SetContextCap


class SetContextCapSubcommand(CurrentSettingOutput, Subcommand[SetContextCap, CurrentSetting]):
    """`journal agent context-cap <profile> <tokens|none|default>`: sets the context size at which agents of one
    helper type are compacted in this environment."""

    cli_name = "agent"
    name = "context-cap"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("profile")
        parser.add_argument("cap")

    def command(self, arguments: Namespace, caller: Caller) -> SetContextCap:
        return SetContextCap(arguments.profile, arguments.cap)
