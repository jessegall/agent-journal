from core.base.actor_type import ActorType
from core.base.change.changed import Changed
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.user_approval import UserApproval
from core.modules.settings.models.setting import Setting
from core.modules.settings.support.setting_catalogue import SettingCatalogue


class PersonSetSettingGuard(Guard[Changed[Setting]]):
    """An agent never writes a setting that drives what an agent may do; every way to write one ends in this row."""

    name = "settings.person-set"
    is_safety = True

    def __init__(self, declared: SettingCatalogue) -> None:
        self.declared = declared

    def check(self, event: Changed[Setting], context: Context) -> None:
        if context.actor.type is ActorType.AGENT and self.declared.is_person_set(event.row.key):
            raise UserApproval(f"Change {self.declared.value(event.row.key).title}?")
