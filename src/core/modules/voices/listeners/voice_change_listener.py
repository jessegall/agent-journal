from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.scope.environment_scope import EnvironmentScope
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.settings.models.setting import Setting
from core.modules.voices.support.voice_lines import VoiceLines
from core.modules.voices.support.voice_nudges import VOICE_CHANGED
from core.modules.voices.support.voices_settings import VOICE_KEYS
from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.command.context import Context


class VoiceChangeListener(SaveListener[Changed[Setting]]):
    """When the voice, the title or the first name changes, every main agent that runs is told the voice it talks
    in from its next chat line."""

    name = "voices.voice-changed"
    disabled_scopes = [EnvironmentScope]

    def __init__(self, queries: Queries, lines: VoiceLines) -> None:
        self.queries, self.lines = queries, lines

    def handle(self, event: Changed[Setting], context: Context) -> None:
        setting = event.row
        if isinstance(event, Deleted) or setting.key not in VOICE_KEYS:
            return
        for agent in MainAgentFinder.all_running(self.queries):
            self.lines.deliver(agent.id, VOICE_CHANGED, context)
