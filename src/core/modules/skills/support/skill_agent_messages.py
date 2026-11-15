from engine.driver.count_down import CountDown
from core.modules.drivers.models.support.tool_use_window import ToolUseWindow
from core.modules.skills.agent_messages.read_skill_first_message import ReadSkillFirstMessage
from core.modules.skills.agent_messages.read_command_skill_first_message import ReadCommandSkillFirstMessage
from core.modules.skills.agent_messages.loaded_skill_refusal_message import LoadedSkillRefusalMessage
from core.modules.skills.agent_messages.unread_skills_message import UnreadSkillsMessage

SKILL_TOOL_USES = 3
SKILL_COUNTDOWN = CountDown("skills.skill_countdown", "load skill {skill}", ToolUseWindow(SKILL_TOOL_USES))

SKILL_AGENT_MESSAGES = [ReadSkillFirstMessage, LoadedSkillRefusalMessage, ReadCommandSkillFirstMessage, SKILL_COUNTDOWN.declaration, UnreadSkillsMessage]
