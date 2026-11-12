from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.settings.commands.apply_setting_screen.apply_setting_screen import ApplySettingScreen
from core.modules.settings.support.setting_screen import ScreenReading


class ApplySettingScreenSubcommand(Subcommand[ApplySettingScreen, ScreenReading]):
    """`journal setting-screen apply <screen> --revision <revision> <key>=<value>...`: changes the settings of one
    screen together, from the reading with that revision."""

    cli_name = "setting-screen"
    name = "apply"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("screen")
        parser.add_argument("--revision", required=True)
        parser.add_argument("changes", nargs="+")

    def command(self, arguments: Namespace, caller: Caller) -> ApplySettingScreen:
        pairs = [change.partition("=") for change in arguments.changes]
        if any(not separator or not key for key, separator, _ in pairs):
            raise Refusal("a change is written key=value", "for example journal.suites.coding.auto-mode=off")
        return ApplySettingScreen(arguments.screen, arguments.revision, tuple((key, text) for key, _, text in pairs))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ScreenReading):
            output.write(f"{value.screen}: {len(value.nodes)} settings, revision {value.revision}", {"screen": value.screen, "revision": value.revision, "nodes": [output.values(node) for node in value.nodes]})
