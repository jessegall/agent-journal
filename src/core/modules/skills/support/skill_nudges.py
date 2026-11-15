from engine.driver.count_down import CountDown
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.skills.nudges.read_skill_first_nudge import ReadSkillFirstNudge
from core.modules.skills.nudges.read_command_skill_first_nudge import ReadCommandSkillFirstNudge
from core.modules.skills.nudges.loaded_skill_refusal_nudge import LoadedSkillRefusalNudge
from core.modules.skills.nudges.unread_skills_nudge import UnreadSkillsNudge

SKILL_TOOL_USES = 3
SKILL_COUNTDOWN = CountDown("skills.skill_countdown", "load skill {skill}", ToolUseSpan(SKILL_TOOL_USES))

SKILL_NUDGES = [ReadSkillFirstNudge, LoadedSkillRefusalNudge, ReadCommandSkillFirstNudge, SKILL_COUNTDOWN.declaration, UnreadSkillsNudge]
