from argparse import Namespace

from engine.caller.caller import Caller
from engine.setting.setting_values import SettingValues
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.support.driver_settings import ACTIVE_SLICES_SETTING


class DriverActiveSubcommand(ReadSubcommand[tuple[str, ...]]):
    """`journal driver active`: the parts of the new driver that answer agents in this environment."""

    cli_name = "driver"
    name = "active"

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def read(self, arguments: Namespace, caller: Caller) -> tuple[str, ...]:
        return self.settings.texts(ACTIVE_SLICES_SETTING) or tuple(["no part of the new driver is active: the old rules answer every agent"])
