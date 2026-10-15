from dataclasses import dataclass

from journal.engine.states.paused import Paused
from journal.engine.transition import Transition
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class LoadingSkill(Paused):
    """Writes wait until the agent has read one skill; reading it goes back to what the agent was doing."""

    name = "loading_skill"
    owed_by_agent = True
    skill: str = ""
    path: str = ""

    def awaiting(self) -> tuple[str, str]:
        return f"the {self.skill} skill to be read", ""

    def tool_starting(self, event: ToolStarting) -> Transition:
        from journal.features.skills.feature import Skills
        return self.refuse(Skills.REQUIRED.about(skill=self.skill, path=self.path)) if event.writes else self.stay()

    def is_(self, skill_name: str) -> bool:
        return self.path.endswith(f"/{skill_name}/SKILL.md")
