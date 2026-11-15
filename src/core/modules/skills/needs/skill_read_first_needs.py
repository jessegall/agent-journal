from core.modules.skills.support.skill_nudges import SKILL_COUNTDOWN
from typing import Any
from collections.abc import Mapping, Sequence

from engine.agent_stack.states.blocked import Blocked
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.needs.need_source import NeedSource
from engine.agent_machine.record.question import Question
from engine.enums.closer_role import CloserRole
from engine.registry.registry import Registry
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.skills.commands.load_skill.support.kept_skills import KeptSkills
from core.modules.skills.support.agent_profile_skills import AgentProfileSkills
from core.modules.skills.nudges.read_skill_first_nudge import ReadSkillFirstNudge
from core.modules.skills.nudges.unread_skills_nudge import UnreadSkillsNudge
from core.modules.skills.support.block_conditions.skill_loaded import SkillLoaded
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.skill_nudges import SKILL_TOOL_USES
from core.modules.skills.support.skill_requirement import SkillRequirement
from core.modules.skills.support.unread_skills import UnreadSkills
from core.modules.skills.needs.command_skill_needs import SKILL_COMMAND
from engine.driver.nudge import Nudge

SKILL_READ_RANK = "skills.read-first"
TOOL_RULE, STOP_RULE, PROFILE_RULE = "skills.read-first", "skills.unread-stop", "skills.profile-read-first"


class SkillReadFirstNeeds(NeedSource):
    """Plans the one block of an agent's due skills (doc 1310 section 4.6): its tools after three uses, its stop
    at once, waived by the agent; a skill the program put back after a compaction counts as read. The two
    scopes keep their two keys and their two texts. A read-only helper is held at once, and only for the
    skills its profile requires; it has no stop scope."""
    state_type = Blocked
    rank = SKILL_READ_RANK

    def __init__(self, unread: UnreadSkills, files: SkillFiles, requirement: SkillRequirement, kept: KeptSkills, agents: AgentRows,
                 profile_skills: AgentProfileSkills, registry: Registry) -> None:
        self.unread, self.files, self.requirement, self.kept, self.agents = unread, files, requirement, kept, agents
        self.profile_skills, self.registry = profile_skills, registry

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        if not self.requirement.is_required:
            return {}
        plans = {agent.agent_id: self.plan(agent, question) for agent in agents}
        return {agent_id: [plan] for agent_id, plan in plans.items() if plan is not None}

    def plan(self, agent: AgentReference, question: Question) -> BlockPlan | None:
        book = self.registry.helper_type_book()
        if agent.agent_type in book.read_access_keys():
            return self.profile_plan(agent)
        if not book.behaviours(agent.agent_type).takes_prompts:
            return None
        names = self.unread.names(agent.agent_id)
        missing = names if self.kept.is_recorded(agent.agent_id) or question.event is None else self.kept.unloaded(agent.agent_id, question.event.transcript, names)
        if not missing:
            return None
        row = self.agents.find(agent.agent_id)
        tool_nudge = ReadSkillFirstNudge.instructed(self.files.agent_instruction(missing[0], row))
        stop_nudge = UnreadSkillsNudge.naming(names)
        return SkillReadFirstNeeds.read_plan(tool_nudge, missing[0], TOOL_RULE, stop_check_key=STOP_RULE, tool_grace_uses=SKILL_TOOL_USES, scope_stop=True,
                                             stop_nudge=stop_nudge, countdown=SKILL_COUNTDOWN.nudge("{left}", skill=missing[0]))

    def profile_plan(self, agent: AgentReference) -> BlockPlan | None:
        required = self.profile_skills.required(agent.agent_id)
        unread = [folder for folder in self.unread.names(agent.agent_id) if folder in required]
        if not unread:
            return None
        nudge = ReadSkillFirstNudge.instructed(self.files.agent_instruction(unread[0], self.agents.find(agent.agent_id)))
        return SkillReadFirstNeeds.read_plan(nudge, unread[0], PROFILE_RULE)

    # the block an agent lifts by reading the skill itself
    @staticmethod
    def read_plan(nudge: Nudge, skill: str, rule: str, **block_fields: Any) -> BlockPlan:
        return BlockPlan(nudge, SkillLoaded(skill), rule, SKILL_READ_RANK, closer_roles=tuple([CloserRole.AGENT]), lifting_lines=tuple([f"{SKILL_COMMAND} {skill}"]),
                         **block_fields)
