from engine.driver.count_down import CountDown
from core.modules.drivers.models.support.tool_use_window import ToolUseWindow
from core.modules.skills.nudges.read_skill_first_message import ReadSkillFirstMessage
from core.modules.skills.nudges.read_command_skill_first_message import ReadCommandSkillFirstMessage
from core.modules.skills.nudges.loaded_skill_refusal_message import LoadedSkillRefusalMessage
from core.modules.skills.nudges.unread_skills_message import UnreadSkillsMessage

SKILL_TOOL_USES = 3
SKILL_COUNTDOWN = CountDown("skills.skill_countdown", "load skill {skill}", ToolUseWindow(SKILL_TOOL_USES))

SKILL_NUDGES = [ReadSkillFirstMessage, LoadedSkillRefusalMessage, ReadCommandSkillFirstMessage, SKILL_COUNTDOWN.declaration, UnreadSkillsMessage]
