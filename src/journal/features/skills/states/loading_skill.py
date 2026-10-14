from dataclasses import dataclass

from journal.engine.states.paused import Paused
from journal.engine.transition import Transition
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class LoadingSkill(Paused):
    """Writes wait until the agent has read one skill; reading it goes back to what the agent was doing."""

    name = "loading_skill"
    skill: str = ""
    path: str = ""

    def tool_starting(self, event: ToolStarting) -> Transition:
        from journal.features.skills.feature import Skills
        return self.refuse(Skills.REQUIRED.about(skill=self.skill, path=self.path)) if event.writes else self.stay()

    def tool_finished(self, event: ToolFinished) -> Transition:
        read = event.read_path.endswith(self.path) if event.read_path else False
        loaded = event.skill_loaded == self.path.split("/")[-2] if event.skill_loaded else False
        return self.back() if read or loaded else self.stay()
