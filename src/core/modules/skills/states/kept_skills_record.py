from collections.abc import Sequence

from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.driver.open_row import OpenRow
from engine.enums.state_tier import StateTier
from core.modules.skills.commands.load_skill.support.kept_skills import KeptSkills
from core.modules.skills.rules.record_kept_skills_rule import RecordKeptSkillsRule
from core.modules.skills.states.skill_load_required import SkillLoadRequired
from core.modules.skills.support.unread_skills import UnreadSkills


class KeptSkillsRecord(AgentState):
    """A skill is due and the agent's session or compaction has no record yet of the skills its program put back: the
    state is open until the deferred rule has recorded them once, after a tool use."""

    name = "skills.kept-record-due"
    tier = StateTier.DEFERRED
    role_group = RoleGroup.PROMPT
    deferred = [RecordKeptSkillsRule]

    def __init__(self, unread_skills: UnreadSkills, kept: KeptSkills) -> None:
        self.unread_skills, self.kept = unread_skills, kept

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        due = self.unread_skills.due_rows(hook.agent_id)
        return [SkillLoadRequired.row(due[0])] if due and not self.kept.is_recorded(hook.agent_id) else []
