from engine.command.context import Context
from engine.command.handler import Handler
from suites.coding.modules.workers.commands.apply_work_settings.apply_work_settings import ApplyWorkSettings
from suites.coding.modules.workers.support.work_controls import WorkControls
from suites.coding.support.work_settings import WorkSettings


class ApplyWorkSettingsHandler(Handler[ApplyWorkSettings, WorkSettings]):
    """Changes the named workflow controls in one step: all of them or none."""

    command = ApplyWorkSettings

    def __init__(self, controls: WorkControls) -> None:
        self.controls = controls

    def handle(self, command: ApplyWorkSettings, context: Context) -> WorkSettings:
        return self.controls.apply(command.revision, command.changes, context)
