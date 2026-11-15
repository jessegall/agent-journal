from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.setting.setting_values import SettingValues
from core.modules.drivers.commands.set_active_slice.set_active_slice import SetActiveSlice
from core.modules.drivers.support.driver_settings import ACTIVE_SLICES_SETTING, READY_SLICES
from core.modules.settings.support.setting_store import SettingStore


class SetActiveSliceHandler(Handler[SetActiveSlice, tuple[str, ...]]):
    """Adds a part of the new driver to the environment's active parts or takes it out; only a person switches
    one, and a part whose phase has not passed its gate cannot become active."""

    command = SetActiveSlice

    def __init__(self, settings: SettingValues, store: SettingStore) -> None:
        self.settings, self.store = settings, store

    def handle(self, command: SetActiveSlice, context: Context) -> tuple[str, ...]:
        if context.actor.is_agent():
            raise Refusal("only a person switches a part of the new driver")
        if command.is_active and command.slice_name.split("@")[0] not in READY_SLICES:
            raise Refusal(f"the part {command.slice_name} of the new driver has not passed its phase's gate", "journal driver active lists the active parts")
        active = [name for name in self.settings.texts(ACTIVE_SLICES_SETTING) if name != command.slice_name]
        slices = tuple([*active, command.slice_name] if command.is_active else active)
        self.store.write(ACTIVE_SLICES_SETTING, list(slices), context.environment_id, context)
        return slices
