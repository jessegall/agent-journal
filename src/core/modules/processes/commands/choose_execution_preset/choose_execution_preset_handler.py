from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.processes.commands.choose_execution_preset.choose_execution_preset import ChooseExecutionPreset
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.settings.commands.set_setting.set_setting import SetSetting
from core.modules.processes.support.execution_presets import ExecutionPresets


class ChooseExecutionPresetHandler(Handler[ChooseExecutionPreset, str]):
    """Writes the lane capacities and the starter share of a preset for the whole project."""

    command = ChooseExecutionPreset

    def __init__(self, bus: Bus) -> None:
        self.bus, self.presets = bus, ExecutionPresets()

    def handle(self, command: ChooseExecutionPreset, context: Context) -> str:
        preset = self.presets.preset(command.name)
        instant, short, long = preset.capacities(self.presets.core_count())
        for setting, value in ((ProcessSetting.LANE_CAPACITY_INSTANT, instant), (ProcessSetting.LANE_CAPACITY_SHORT, short),
                               (ProcessSetting.LANE_CAPACITY_LONG, long), (ProcessSetting.STARTER_CAP_PERCENT, preset.starter_cap_percent)):
            self.bus.dispatch(SetSetting(setting.key, str(value), project=True), context)
        return f"preset {preset.name}: instant {instant}, short {short}, long {long} slot units"
