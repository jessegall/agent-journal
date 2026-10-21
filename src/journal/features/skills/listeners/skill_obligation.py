from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.session_started import SessionStarted
from journal.events.agent_listener import AgentListener
from journal.features.skills.support.skills_data_reader import SkillsDataReader
from journal.repositories.agents import Agents
from journal.support.actor import Actor


class SkillObligation(AgentListener[AgentEvent]):
    """The skills a start or a prompt calls for, as the skills conduct names them, are noted as owed on the agent's row, beside those already owed, so a write waits until they are read."""

    blocking = True

    def __init__(self, agents: Agents, reader: SkillsDataReader) -> None:
        self.agents, self.reader = agents, reader

    def handle(self, event: AgentEvent) -> None:
        if not isinstance(event, (SessionStarted, PromptSubmitted)):
            return
        agent = self.agents.for_session(event.session)
        data = self.reader.read(agent)
        due = data.named_in(event.prompt) if isinstance(event, PromptSubmitted) else data.due_at_start(agent.state)
        names = tuple(card.name for card in due)
        if set(names) - set(agent.skills_owed):
            self.agents.touched(agent, Actor.system(), lambda time: {"skills_owed": tuple(dict.fromkeys((*time.skills_owed, *names)))})
