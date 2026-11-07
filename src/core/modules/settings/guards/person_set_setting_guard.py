from core.base.agent_role import AgentRole
from core.base.listener.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.base.actor_type import ActorType
from core.base.change.changed import Changed
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.refusal import Refusal
from core.modules.settings.models.setting import Setting
from core.modules.settings.support.setting_catalogue import SettingCatalogue


class PersonSetSettingGuard(Guard[Changed[Setting]]):
    """An agent never writes a setting that drives what an agent may do; every way to write one ends in this row."""

    name = "settings.person-set"
    is_safety = True

    def __init__(self, declared: SettingCatalogue, rows: EventRows) -> None:
        self.declared, self.rows = declared, rows

    def check(self, event: Changed[Setting], context: Context) -> None:
        if context.actor.type is ActorType.AGENT and self.declared.is_person_set(event.row.key):
            agent = self.rows.required(Agent, context.actor.id)
            if agent.role != AgentRole.MAIN:
                raise Refusal(f"a {agent.role} cannot change {event.row.key}", "ask the main agent")
            raise Refusal(f"only a person changes {event.row.key}", f"a main agent asks with journal setting request {event.row.key} <value> --reason '<why>'; any other agent writes what it needs in its report")
