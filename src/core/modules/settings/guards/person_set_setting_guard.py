from core.base.actor_type import ActorType
from core.base.change.changed import Changed
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.database.actor_table import ActorTable
from engine.errors.refusal import Refusal
from engine.errors.user_approval_refusal import UserApprovalRefusal
from core.modules.settings.models.setting import Setting
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from core.modules.settings.support.setting_revision import SettingRevision


class PersonSetSettingGuard(Guard[Changed[Setting]]):
    """An agent never writes a setting that drives what an agent may do; every way to write one ends in this
    row. The change waits for a person with the revision of the setting as the agent saw it, so an approval
    that comes after the setting changed is refused."""

    name = "settings.person-set"
    is_safety = True

    def __init__(self, declared: SettingCatalogue, revision: SettingRevision, actors: ActorTable) -> None:
        self.declared, self.revision, self.actors = declared, revision, actors

    def check(self, event: Changed[Setting], context: Context) -> None:
        if context.actor.type is ActorType.AGENT and self.declared.is_person_set(event.row.key):
            entry = self.declared.value(event.row.key)
            owner = self.actors.row_owner(context.actor.id) if entry.requires_main_agent else None
            if entry.requires_main_agent and (owner is None or not owner.is_main):
                raise Refusal("only the main agent can ask to change this setting")
            raise UserApprovalRefusal(f"Change {entry.title}?", self.arguments(event.row))

    def arguments(self, row: Setting) -> tuple[str, ...]:
        project = tuple(["--project"]) if row.environment_id is None else ()
        return ("setting", "set", row.key, row.value_text(), *project, "--expected-revision", self.revision.current(row.key))
