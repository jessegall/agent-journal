import json

from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.types.type_guards import is_list, is_tuple
from core.modules.settings.bindings.support.context_caps import CONTEXT_LIMIT_PROFILES, NO_CAP
from core.modules.settings.commands.set_setting.set_setting import SetSetting
from core.modules.settings.support.current_setting import CurrentSetting
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.usage.commands.set_context_cap.set_context_cap import SetContextCap

DEFAULT_CAP = "default"


class SetContextCapHandler(Handler[SetContextCap, CurrentSetting]):
    """Writes the context size list per helper type with the type's entry replaced, added or taken out; the setting
    command refuses anyone but a person."""

    command = SetContextCap

    def __init__(self, settings: SettingReader, bus: Bus) -> None:
        self.settings, self.bus = settings, bus

    def handle(self, command: SetContextCap, context: Context) -> CurrentSetting:
        cap = command.cap.strip().lower()
        if cap not in (NO_CAP, DEFAULT_CAP) and not cap.isdigit():
            raise Refusal(f"{command.cap} is no context size", f"give a number of tokens, {NO_CAP} or {DEFAULT_CAP}")
        stored = self.settings.current(CONTEXT_LIMIT_PROFILES).value
        others = [str(item) for item in stored if str(item).rpartition(":")[0].strip() != command.profile] if is_list(stored) or is_tuple(stored) else []
        entries = others if cap == DEFAULT_CAP else [*others, f"{command.profile}:{cap}"]
        return self.bus.dispatch(SetSetting(CONTEXT_LIMIT_PROFILES, json.dumps(entries), False), context)
