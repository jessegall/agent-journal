from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.modules.settings.commands.support.current_setting_output import CurrentSettingOutput
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.refusal import Refusal
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.settings.support.undeclared_settings import UndeclaredSettings
from core.modules.settings.support.current_setting import CurrentSetting


class SettingShowSubcommand(CurrentSettingOutput, ReadSubcommand[CurrentSetting]):
    """`journal setting show <key>`: a declared setting's value here and where it comes from; a secret only as
    set."""

    cli_name = "setting"
    name = "show"

    def __init__(self, values: SettingReader, declared: SettingCatalogue, undeclared: UndeclaredSettings) -> None:
        self.values, self.declared, self.undeclared = values, declared, undeclared

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("key")

    def read(self, arguments: Namespace, caller: Caller) -> CurrentSetting:
        try:
            return self.values.current(arguments.key)
        except Refusal:
            kept = self.undeclared.current(self.declared.all(), arguments.key)
            if kept is None:
                raise
            return kept
