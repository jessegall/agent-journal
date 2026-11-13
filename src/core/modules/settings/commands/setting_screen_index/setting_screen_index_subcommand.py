from argparse import Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.settings.support.setting_screen import SettingScreen
from core.modules.settings.support.screen_index_entry import ScreenIndexEntry


class SettingScreenIndexSubcommand(ReadSubcommand[tuple[ScreenIndexEntry, ...]]):
    """`journal setting-screen index`: every setting that declares a screen, with where it lives in words and the
    screen and section that open to it; the one list Find a setting searches."""

    cli_name = "setting-screen"
    name = "index"

    def __init__(self, screens: SettingScreen) -> None:
        self.screens = screens

    def read(self, arguments: Namespace, caller: Caller) -> tuple[ScreenIndexEntry, ...]:
        return self.screens.index()

    def write_output(self, value: object, output: Output) -> None:
        entries = [entry for entry in value if isinstance(entry, ScreenIndexEntry)] if isinstance(value, tuple) else []
        output.write("\n".join(f"{entry.title}: {entry.path}" for entry in entries), {"rows": [output.values(entry) for entry in entries]})
