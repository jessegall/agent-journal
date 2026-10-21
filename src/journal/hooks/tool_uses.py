from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.compacting import Compacting
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.models.agent import Agent
from journal.repositories.agents import Agents
from journal.support.actor import Actor


class ToolUses:
    """One tool-use counter per session, kept on the agent's row and carried on every tool event: a plain tool use of the agent's own moves it by one as its ToolStarting is placed; a journal command and a subagent's tool use leave it where it is and carry the unchanged number; a compaction sets it back to zero, with the inbox mark, since the agent after it is as good as new."""

    def __init__(self, agents: Agents) -> None:
        self.agents = agents

    def counted(self, event: AgentEvent) -> AgentEvent:
        if not isinstance(event, (ToolStarting, ToolFinished, Compacting)):
            return event
        rows = self.agents.across_environments(session=event.session)
        if not rows:
            return event
        if isinstance(event, Compacting):
            self.agents.save(rows[0].compacted(), Actor.system())
            return event
        return self.tool_counted(event, rows[0])

    def tool_counted(self, event: AgentEvent, agent: Agent) -> AgentEvent:
        if isinstance(event, ToolStarting) and not event.call.is_journal and not event.subagent:
            agent = self.agents.save(agent.tool_used(), Actor.system())
        return event.counted(agent.tool_uses)
