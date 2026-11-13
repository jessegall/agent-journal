from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.settings.commands.apply_setting_screen.apply_setting_screen import ApplySettingScreen
from core.modules.settings.support.screen_reading import ScreenReading


class ApplySettingScreenSubcommand(Subcommand[ApplySettingScreen, ScreenReading]):
    """`journal setting-screen apply <screen> --revision <revision> [--also <screen>=<revision>]...
    <key>=<value>...`: changes the settings of one screen, and of the further screens named with
    --also, together, each from the reading with its revision."""

    cli_name = "setting-screen"
    name = "apply"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("screen")
        parser.add_argument("--revision", required=True)
        parser.add_argument("--also", action="append", default=[])
        parser.add_argument("changes", nargs="+")

    def command(self, arguments: Namespace, caller: Caller) -> ApplySettingScreen:
        pairs = [change.partition("=") for change in arguments.changes]
        if any(not separator or not key for key, separator, _ in pairs):
            raise Refusal("a change is written key=value", "for example journal.core.project-rules.agents-make-rules=on")
        also = [screen.partition("=") for screen in arguments.also]
        if any(not separator or not name or not revision for name, separator, revision in also):
            raise Refusal("a further screen is written screen=revision", "for example --also tests=3f9a1c2b7d4e")
        return ApplySettingScreen(arguments.screen, arguments.revision, tuple((key, text) for key, _, text in pairs), tuple((name, revision) for name, _, revision in also))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ScreenReading):
            output.write(f"{value.screen}: {len(value.nodes)} settings, revision {value.revision}", {"screen": value.screen, "revision": value.revision, "nodes": [output.values(node) for node in value.nodes]})
