from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.settings.support.setting_screen import SettingScreen
from core.modules.settings.support.screen_reading import ScreenReading

TYPE_SEPARATOR = "."


class SettingScreenShowSubcommand(ReadSubcommand[ScreenReading]):
    """`journal setting-screen show <screen>`: every setting that declares the screen as a node the
    viewer draws without knowing any setting; --type names a helper type, whose screen is the screen
    name, a dot and the type."""

    cli_name = "setting-screen"
    name = "show"

    def __init__(self, screens: SettingScreen) -> None:
        self.screens = screens

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("screen")
        parser.add_argument("--type", default="")

    def read(self, arguments: Namespace, caller: Caller) -> ScreenReading:
        return self.screens.read(f"{arguments.screen}{TYPE_SEPARATOR}{arguments.type}" if arguments.type else arguments.screen)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, ScreenReading):
            return
        lines = [f"{node.section}: {node.key} = {node.value} ({node.source}, {node.component})" for node in value.nodes]
        output.write("\n".join(lines) or f"no setting declares the screen {value.screen}", {"screen": value.screen, "revision": value.revision, "nodes": [output.values(node) for node in value.nodes]})
