from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

READ_SKILL_FIRST = NudgeDeclaration("skills.read_skill_first", NudgeType.REFUSAL, 'read this first: {path}')
UNREAD_SKILLS = NudgeDeclaration("skills.unread_skills", NudgeType.REFUSAL, 'unread skills: {skills}')

SKILL_NUDGES = [READ_SKILL_FIRST, UNREAD_SKILLS]
