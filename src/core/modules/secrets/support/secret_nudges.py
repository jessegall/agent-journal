from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

SECRETS_FOLDER_BAN = NudgeDeclaration("secrets.out_of_reach", NudgeType.SAFETY_REFUSAL, 'the secrets folder is out of reach: run a program with a secret through the secret command')

SECRET_NUDGES = [SECRETS_FOLDER_BAN]
