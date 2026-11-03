from core.base.agent_role import AgentRole
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.agents.models.agent import Agent
from core.modules.voices.support.voice_lines import VoiceLines
from core.modules.voices.support.voice_nudges import TALK_LIKE_AND_INTRODUCE


class VoiceStartListener(SaveListener):
    """A main agent that starts is told how to talk to the user and to introduce itself in that voice; an agent that
    resumes is the same agent, whose conversation already holds both."""

    name = "voices.start"
    event = "agent.create"

    def __init__(self, lines: VoiceLines) -> None:
        self.lines = lines

    def handle(self, change: Change[Model]) -> None:
        agent = change.new_row
        if isinstance(agent, Agent) and agent.role is AgentRole.MAIN:
            self.lines.tell(agent.id, TALK_LIKE_AND_INTRODUCE, change)
