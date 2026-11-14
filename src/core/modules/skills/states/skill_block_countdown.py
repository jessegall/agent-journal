from collections.abc import Sequence

from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.skills.support.skill_nudges import READ_COMMAND_SKILL_FIRST, READ_SKILL_FIRST, SKILL_COUNTDOWN, SKILL_TOOL_USES
from engine.driver.states.countdown_state import CountdownState


class SkillBlockCountdown(CountdownState):
    """The hold on an agent that has not read a skill it needs: three tool uses count down, then its tools
    are refused until the skill is loaded. Its refusal is worded for the skill, so a rule hands the
    rendered refusal to start. The state is open while the hold is; it gates no rule."""

    name = "skills.skill-block"
    span = ToolUseSpan(SKILL_TOOL_USES)
    refusal = READ_SKILL_FIRST
    countdown = SKILL_COUNTDOWN

    def keys(self) -> Sequence[str]:
        return [READ_SKILL_FIRST.key, READ_COMMAND_SKILL_FIRST.key]
