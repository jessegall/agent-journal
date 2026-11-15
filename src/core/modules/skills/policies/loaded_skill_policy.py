from collections.abc import Sequence
from pathlib import PurePath

from engine.agent_stack.reason import Reason
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.record.question import Question
from engine.enums.decision_class import DecisionClass
from engine.enums.grant_type import GrantType
from core.modules.skills.nudges.loaded_skill_refusal_message import LoadedSkillRefusalMessage
from core.modules.skills.support.agent_skill_rows import AgentSkillRows
from core.modules.skills.support.skill_catalogue import SkillCatalogue

SKILLS_POLICY_RANK = "skills.policies"


class LoadedSkillPolicy(Policy):
    """Refuses a read of a skill the agent has loaded in this context with the very text the catalogue holds now; a
    refusal skip passes it."""
    key = "skills.already-loaded"
    rank = SKILLS_POLICY_RANK
    grant_types = [GrantType.REFUSAL_SKIP]

    def __init__(self, rows: AgentSkillRows, catalogue: SkillCatalogue) -> None:
        self.rows, self.catalogue = rows, catalogue

    def refusals(self, question: Question, view: AgentView) -> Sequence[Reason]:
        tool = question.tool()
        if tool is None or not tool.is_skill_read:
            return []
        folders = {PurePath(path).parent.name for path in tool.files}
        loaded = [skill.folder for skill in self.catalogue.skills() if skill.folder in folders and self.rows.is_loaded(view.agent.agent_id, skill.folder, skill.digest)]
        return [Reason(self.key, DecisionClass.REFUSE, self.rank, LoadedSkillRefusalMessage.declared().nudge(name=loaded[0]).text)] if loaded else []
