from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

SECRETS_FOLDER_BAN = NudgeDeclaration("secrets.out_of_reach", NudgeType.REFUSAL, 'the secrets folder is out of reach: give a secret to a program with journal secret run <n> -- <program>')

SECRET_NUDGES = [SECRETS_FOLDER_BAN]
