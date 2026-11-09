from core.base.driver.agent_hook import AgentHook
from core.base.driver.interval import Interval
from core.base.driver.nudge import Nudge
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.skills.support.block_conditions.skill_loaded import SkillLoaded
from core.modules.skills.support.skill_nudges import SKILL_COUNTDOWN, SKILL_TOOL_USES


class SkillBlock:
    """Holds an agent until a skill is loaded, once its three tool uses have passed."""

    @staticmethod
    def answer(hook: AgentHook, nudge: Nudge, folder: str, strict: bool = False) -> RuleAnswer:
        return RuleAnswer.allowed().blocking_after(hook, nudge, SkillLoaded(folder), Interval(ToolUseSpan(SKILL_TOOL_USES)), SKILL_COUNTDOWN.nudge("{left}", skill=folder), strict)
