import json

from core.base.actor_type import ActorType
from core.base.change.changed import Changed
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.user_approval import UserApproval
from core.modules.settings.models.setting import Setting
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from core.modules.settings.support.setting_revision import SettingRevision


class PersonSetSettingGuard(Guard[Changed[Setting]]):
    """An agent never writes a setting that drives what an agent may do; every way to write one ends in this row.
    The change waits for a person with the revision of the setting as the agent saw it, so an approval that comes
    after the setting changed is refused."""

    name = "settings.person-set"
    is_safety = True

    def __init__(self, declared: SettingCatalogue, revision: SettingRevision) -> None:
        self.declared, self.revision = declared, revision

    def check(self, event: Changed[Setting], context: Context) -> None:
        if context.actor.type is ActorType.AGENT and self.declared.is_person_set(event.row.key):
            raise UserApproval(f"Change {self.declared.value(event.row.key).title}?", self.arguments(event.row))

    def arguments(self, row: Setting) -> tuple[str, ...]:
        value = json.loads(row.value)
        text = value if isinstance(value, str) else json.dumps(value)
        project = ("--project",) if row.environment_id is None else ()
        return ("setting", "set", row.key, text, *project, "--expected-revision", self.revision.current(row.key))
