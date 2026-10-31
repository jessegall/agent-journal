from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.agent_mark_type import AgentMarkType
from core.modules.agents.models.enums.agent_mark_variant import AgentMarkVariant
from core.modules.chat.listeners.mark_listener import MarkListener

AGENTS_MODULE = "journal.core.agents"


class SubagentMarkListener(MarkListener):
    """When a subagent starts or ends, the chat shows a mark under that subagent's id, which the viewer reads to
    fold a subagent's marks together."""

    name = "agents.subagent-mark"
    event = "agent.*"
    module_name = AGENTS_MODULE

    def handle(self, event: LoggedEvent) -> None:
        agent = self.queries.query(Agent).find(event.row_id)
        if agent.role is not AgentRole.SUBAGENT:
            return
        if event.event == "agent.create":
            self.show(event, AgentMarkType.SUBAGENT, AgentMarkVariant.STARTED, f"Subagent {agent.id} started", agent.environment_id, agent.id, "agent", agent.id)
        if event.event == "agent.update" and "ended_at" in event.data and agent.ended_at is not None:
            self.show(event, AgentMarkType.SUBAGENT, AgentMarkVariant.ENDED, f"Subagent {agent.id} ended", agent.environment_id, agent.id, "agent", agent.id)
