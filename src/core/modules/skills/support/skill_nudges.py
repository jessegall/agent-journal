from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

READ_SKILL_FIRST = NudgeDeclaration("skills.read_skill_first", NudgeType.REFUSAL, 'a skill is unread: {instruction}',
                                  path_fields=["instruction"])
READ_COMMAND_SKILL_FIRST = NudgeDeclaration("skills.read_command_skill_first", NudgeType.REFUSAL, 'this command needs a skill you have not read: {instruction}',
                                          path_fields=["instruction"])
UNREAD_SKILLS = NudgeDeclaration("skills.unread_skills", NudgeType.REFUSAL, 'unread skills: {skills}')

SKILL_NUDGES = [READ_SKILL_FIRST, READ_COMMAND_SKILL_FIRST, UNREAD_SKILLS]
