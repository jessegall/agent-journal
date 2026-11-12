from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

SECRETS_FOLDER_BAN = NudgeDeclaration("secrets.out_of_reach", NudgeType.SAFETY_REFUSAL, "The secrets folder is off limits: run programs that need a secret through the secret command")

SECRET_NUDGES = [SECRETS_FOLDER_BAN]
