from core.base.agent_role import AgentRole
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.settings.models.setting import Setting
from core.modules.voices.support.voice_lines import VoiceLines
from core.modules.voices.support.voice_nudges import TALK_LIKE_FROM_NOW_ON
from core.modules.voices.support.voices_settings import VOICE_KEYS


class VoiceChangeListener(SaveListener):
    """When the voice, the title or the first name changes, every main agent that runs is told the voice it talks
    in from its next chat line."""

    name = "voices.voice-changed"
    event = "setting.*"

    def __init__(self, queries: Queries, lines: VoiceLines) -> None:
        self.queries, self.lines = queries, lines

    def handle(self, change: Change[Model]) -> None:
        setting = change.row
        if not isinstance(setting, Setting) or setting.key not in VOICE_KEYS or change.new_row is None:
            return
        for agent in self.queries.query(Agent).filter(role=AgentRole.MAIN).matching(IsNull("ended_at")).all_rows():
            self.lines.tell(agent.id, TALK_LIKE_FROM_NOW_ON, change)
