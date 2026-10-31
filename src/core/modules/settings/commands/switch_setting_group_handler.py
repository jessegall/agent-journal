from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.registry.setting_entry import GROUP_TYPE
from core.modules.settings.commands.switch_setting_group import SwitchSettingGroup
from core.modules.settings.commands.support.setting_store import SettingStore
from core.modules.settings.support.declared_settings import DeclaredSettings
from core.modules.settings.support.declared_values import DeclaredValues
from core.modules.settings.support.current_setting import CurrentSetting


class SwitchSettingGroupHandler(Handler[SwitchSettingGroup, CurrentSetting]):
    """Keeps whether a toggleable group is on as a setting of the group's own key; only the user switches one."""

    command = SwitchSettingGroup

    def __init__(self, declared: DeclaredSettings, values: DeclaredValues, store: SettingStore) -> None:
        self.declared, self.values, self.store = declared, values, store

    def handle(self, command: SwitchSettingGroup, context: Context) -> CurrentSetting:
        entry = self.declared.entry(command.key)
        if entry.type != GROUP_TYPE or not entry.toggleable:
            raise Refusal(f"{entry.key} cannot be switched off", "only a group that says it can be switched off is")
        if context.actor.type is not ActorType.USER:
            raise Refusal(f"ask the user to switch {entry.key}")
        if not command.project and context.environment_id is None:
            raise Refusal(f"{entry.key} needs an environment or the whole project", "name --environment, or add --project")
        self.store.write(entry.key, command.enabled, None if command.project else context.environment_id, context)
        return self.values.current(entry.key, context.environment_id)
