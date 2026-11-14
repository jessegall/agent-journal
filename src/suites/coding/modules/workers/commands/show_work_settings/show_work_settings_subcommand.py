from argparse import Namespace

from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from suites.coding.modules.workers.support.work_controls import WorkControls
from suites.coding.support.work_settings import WorkSettings


class ShowWorkSettingsSubcommand(ReadSubcommand[WorkSettings]):
    """`journal work-settings show`: the workflow controls of the main agent, the preset they match or custom, and
    the revision a change must name."""

    cli_name = "work-settings"
    name = "show"

    def __init__(self, controls: WorkControls) -> None:
        self.controls = controls

    def read(self, arguments: Namespace, caller: Caller) -> WorkSettings:
        return self.controls.shown()
