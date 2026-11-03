from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

PATH_LIMIT_CHARACTERS = 4096
REMINDER_LIMIT_CHARACTERS = PATH_LIMIT_CHARACTERS + 128

READ_SKILL_FIRST = NudgeDeclaration("skills.read_skill_first", NudgeType.REFUSAL, 'read this first: {path}',
                                  longest_characters=REMINDER_LIMIT_CHARACTERS, field_limit_characters=PATH_LIMIT_CHARACTERS)
READ_COMMAND_SKILL_FIRST = NudgeDeclaration("skills.read_command_skill_first", NudgeType.REFUSAL, 'read this first: {path}',
                                          longest_characters=REMINDER_LIMIT_CHARACTERS, field_limit_characters=PATH_LIMIT_CHARACTERS)
UNREAD_SKILLS = NudgeDeclaration("skills.unread_skills", NudgeType.REFUSAL, 'unread skills: {skills}')

SKILL_NUDGES = [READ_SKILL_FIRST, READ_COMMAND_SKILL_FIRST, UNREAD_SKILLS]
