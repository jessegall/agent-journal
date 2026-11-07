from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.settings.commands.set_setting.set_setting import SetSetting
from core.modules.settings.support.current_setting import CurrentSetting
from core.modules.voices.support.builtin_catalogue import BuiltinCatalogue
from core.modules.voices.support.voices_settings import PROFILE_KEY


class ChooseVoiceSubcommand(Subcommand[SetSetting, CurrentSetting]):
    """`journal voice choose <name>`: the agent talks in this voice. Only the user chooses it."""

    cli_name = "voice"
    name = "choose"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("name", choices=BuiltinCatalogue.NAMES)

    def command(self, arguments: Namespace, caller: Caller) -> SetSetting:
        return SetSetting(PROFILE_KEY, arguments.name, True)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, CurrentSetting):
            output.line(f"voice: {value.value}")
