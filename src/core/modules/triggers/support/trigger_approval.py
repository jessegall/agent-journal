from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.setting.setting_values import SettingValues
from core.modules.triggers.support.trigger_settings import AGENTS_ENABLE_SETTING


class TriggerApproval:
    """Says whether a trigger needs the user: one an agent makes or changes does, unless the setting lets agents
    enable their own."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def needs_user(self, actor: Actor) -> bool:
        return actor.type is ActorType.AGENT and not self.settings.flag(AGENTS_ENABLE_SETTING)
