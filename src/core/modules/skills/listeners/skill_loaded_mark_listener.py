from engine.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.skill_mark_type import SkillMarkType
from core.modules.skills.models.enums.skill_mark_variant import SkillMarkVariant
from engine.change.moved import Moved
from core.modules.skills.models.lifecycles.agent_skill_lifecycle import AgentSkillLifecycle


class SkillLoadedMarkListener(MarkListener[Moved[AgentSkill]]):
    """When an agent loads a skill, its chat shows a mark naming the skill."""

    name = "skills.loaded-mark"
    moves = tuple([AgentSkillLifecycle.load])
    module_name = "journal.core.skills"

    def handle(self, event: Moved[AgentSkill], logged: LoggedEvent) -> None:
        row = event.row
        self.show(logged, SkillMarkType.SKILL, SkillMarkVariant.LOADED, f"Skill {row.skill} loaded", row.session_agent_id, "agent_skill", row.id)
