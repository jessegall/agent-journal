from core.base.actor import Actor
from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.driver.hook_event_name import HookEventName
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.agents.commands.end_agent import EndAgent
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall


class SubagentStopListener(CommitListener):
    """A subagent sends no session end, so the stop the journal lets through ends its agent row."""

    name = "drivers.subagent-stop"
    event = "hook_call.create"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: LoggedEvent) -> None:
        call = self.queries.query(HookCall).find(event.row_id)
        if call.hook != HookEventName.STOP or call.answer is not HookAnswer.ALLOWED:
            return
        agent = self.queries.query(Agent).find(call.agent_id)
        if agent.role is AgentRole.SUBAGENT and agent.ended_at is None:
            self.bus.run(EndAgent(agent.id), Actor.core(), cause_id=event.id, environment_id=event.environment_id)
