import json

from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.registry.registry import Registry
from engine.types.type_guards import is_list, is_tuple
from core.modules.settings.commands.set_setting.set_setting import SetSetting
from core.modules.settings.support.current_setting import CurrentSetting
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.usage.commands.set_profile_limits.set_profile_limits import SetProfileLimits


class SetProfileLimitsHandler(Handler[SetProfileLimits, CurrentSetting]):
    """Writes the limits list of the caller's environment with the profile's entry replaced or added; the setting
    command refuses anyone but a person."""

    command = SetProfileLimits

    def __init__(self, registry: Registry, settings: SettingReader, bus: Bus) -> None:
        self.registry, self.settings, self.bus = registry, settings, bus

    def handle(self, command: SetProfileLimits, context: Context) -> CurrentSetting:
        entry = next((entry for entry in self.registry.helper_types if entry.key == command.agent_type), None)
        if entry is None or not entry.profile_limits_key:
            raise Refusal(f"{command.agent_type} agents have no limits per profile", "name a type whose profiles have limits of their own")
        stored = self.settings.current(entry.profile_limits_key).value
        others = [str(item) for item in stored if str(item).partition(":")[0] != command.profile] if is_list(stored) or is_tuple(stored) else []
        text = json.dumps([*others, f"{command.profile}:{command.run}:{command.kept}"])
        return self.bus.dispatch(SetSetting(entry.profile_limits_key, text, False), context)
