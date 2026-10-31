from core.base.change.logged_event import LoggedEvent
from core.modules.agents.models.agent import Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.skill_mark_type import SkillMarkType
from core.modules.skills.models.enums.skill_mark_variant import SkillMarkVariant


class SkillLoadedMarkListener(MarkListener):
    """When an agent loads a skill, its chat shows a mark naming the skill."""

    name = "skills.loaded-mark"
    event = "agent_skill.load"
    module_name = "journal.core.skills"

    def handle(self, event: LoggedEvent) -> None:
        row = self.queries.query(AgentSkill).find(event.row_id)
        environment_id = self.queries.query(Agent).find(row.agent_id).environment_id
        self.show(event, SkillMarkType.SKILL, SkillMarkVariant.LOADED, f"Skill {row.skill} loaded", environment_id, row.agent_id, "agent_skill", row.id)
