import io
import shlex
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.console import Console
from engine.subcommand.output import Output
from engine.subcommand.overview_command import OverviewCommand
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.overview.support.overview_blocks import OverviewBlocks
from core.modules.overview.support.overview_page import OverviewPage
from core.modules.overview.support.overview_section import OverviewSection
from core.modules.overview.support.overview_settings import COMMANDS_KEY
from engine.setting.setting_values import SettingValues


class OverviewSubcommand(OverviewCommand, ReadSubcommand[OverviewPage]):
    """`journal overview`: everything open or running here, as the commands the setting
    journal.core.overview.commands names show it, each under its own heading."""

    cli_name = "overview"
    name = "overview"

    def __init__(self, console: Console, values: SettingValues, blocks: OverviewBlocks) -> None:
        self.console, self.values, self.blocks = console, values, blocks

    # While the journal holds the agent until it runs journal overview, a second read goes through, so it is never told
    # it read the overview already while the journal still waits for it.
    def is_read_required(self, arguments: Namespace, caller: Caller) -> bool:
        return self.blocks.is_held(caller.actor.id)

    def arguments(self, parser: ArgumentParser) -> None:
        pass

    def read(self, arguments: Namespace, caller: Caller) -> OverviewPage:
        commands = self.values.texts(COMMANDS_KEY)
        return OverviewPage(tuple(OverviewSection(command, self.command_text(command, caller)) for command in commands))

    def command_text(self, command: str, caller: Caller) -> str:
        stream = io.StringIO()
        self.console.run(shlex.split(command), caller, stream)
        return stream.getvalue().strip()

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, OverviewPage):
            output.write(value.text(), value.json())
