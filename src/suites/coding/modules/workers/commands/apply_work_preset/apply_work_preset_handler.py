from engine.command.context import Context
from engine.command.handler import Handler
from suites.coding.modules.workers.commands.apply_work_preset.apply_work_preset import ApplyWorkPreset
from suites.coding.modules.workers.support.work_controls import WorkControls
from suites.coding.support.work_settings import WorkSettings


class ApplyWorkPresetHandler(Handler[ApplyWorkPreset, WorkSettings]):
    """Writes the controls of a preset in one step."""

    command = ApplyWorkPreset

    def __init__(self, controls: WorkControls) -> None:
        self.controls = controls

    def handle(self, command: ApplyWorkPreset, context: Context) -> WorkSettings:
        return self.controls.preset(command.name, command.revision, context)
