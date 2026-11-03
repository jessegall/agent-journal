from core.base.change.change import Change
from core.base.model.model import Model
from core.base.repository.repository import Repository
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.voices.support.voice_choice import VoiceChoice

SOURCE = "voices.voice"


class VoiceLines:
    """Saves the line that tells a main agent the voice it talks to the user in; the agent is handed it with its
    next hook."""

    def __init__(self, repository: Repository, choice: VoiceChoice) -> None:
        self.repository, self.choice = repository, choice

    def tell(self, agent_id: int, template: str, change: Change[Model]) -> None:
        text = template.format(voice=self.choice.instruction())
        self.repository.save(AgentLine(agent_id=agent_id, creator_id=change.actor.id, text=text, source=SOURCE), change.context)
