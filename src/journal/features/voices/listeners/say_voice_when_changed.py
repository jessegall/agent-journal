from journal.engine.states.ended import Ended
from journal.events.models.saved import Saved
from journal.events.listener import Listener
from journal.features.voices.chosen_voice import ChosenVoice
from journal.models.setting import Setting
from journal.repositories.agents import Agents
from journal.supervisor_link import SupervisorLink


class SayVoiceWhenChanged(Listener[Saved]):
    """A change to the voice, title or name reaches the running agent at once, typed in; a change to the figure's look is no change of voice."""

    def __init__(self, chosen: ChosenVoice, agents: Agents, supervisor: SupervisorLink) -> None:
        self.chosen, self.agents, self.supervisor = chosen, agents, supervisor

    def handle(self, event: Saved) -> None:
        from journal.features.voices.feature import Voices
        setting = event.model
        if not isinstance(setting, Setting) or setting.key not in {o.key for o in Voices.SPOKEN}:
            return
        for agent in self.agents.everywhere():
            if agent.state != Ended.name:
                self.supervisor.type(agent.environment_id, Voices.CHANGED.about(voice=self.chosen.instruction()).rendered())
