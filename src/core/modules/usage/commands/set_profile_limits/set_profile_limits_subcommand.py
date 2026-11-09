from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.settings.commands.support.current_setting_output import CurrentSettingOutput
from core.modules.settings.support.current_setting import CurrentSetting
from core.modules.usage.commands.set_profile_limits.set_profile_limits import SetProfileLimits


class SetProfileLimitsSubcommand(CurrentSettingOutput, Subcommand[SetProfileLimits, CurrentSetting]):
    """`journal agent profile-limits <type> <profile> --running <n> --kept <n>`: sets how many agents of one profile
    run and are kept in this environment."""

    cli_name = "agent"
    name = "profile-limits"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_type")
        parser.add_argument("profile")
        parser.add_argument("--running", type=int, required=True)
        parser.add_argument("--kept", type=int, required=True)

    def command(self, arguments: Namespace, caller: Caller) -> SetProfileLimits:
        return SetProfileLimits(arguments.agent_type, arguments.profile, arguments.running, arguments.kept)
