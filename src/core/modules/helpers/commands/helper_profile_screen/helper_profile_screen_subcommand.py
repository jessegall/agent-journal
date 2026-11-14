from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.helpers.support.helper_profile_screen import HelperProfileScreen
from core.modules.settings.support.screen_reading import ScreenReading


class HelperProfileScreenSubcommand(ReadSubcommand[ScreenReading]):
    """`journal helper-profile-screen show <profile>`: the limits of one read-only helper profile as nodes, each
    saying whether it holds the value of the Read-only helpers line (Every profile) or its own."""

    cli_name = "helper-profile-screen"
    name = "show"

    def __init__(self, screen: HelperProfileScreen) -> None:
        self.screen = screen

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("profile")

    def read(self, arguments: Namespace, caller: Caller) -> ScreenReading:
        return self.screen.read(arguments.profile)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, ScreenReading):
            return
        lines = [f"{node.section}: {node.title} = {node.value} ({node.source})" for node in value.nodes]
        output.write("\n".join(lines), {"screen": value.screen, "revision": value.revision, "nodes": [output.values(node) for node in value.nodes]})
