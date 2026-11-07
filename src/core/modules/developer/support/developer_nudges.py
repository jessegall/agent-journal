from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

EXCEPTION_LINE = NudgeDeclaration("developer.exception", NudgeType.STEERING, "journal-exception:{exception}: journal journal-exception show {exception}", turn_limited=False, wakes_agent=True, plural_text="journal-exceptions {exception}: read each with journal journal-exception show <id>", id_field="exception")
DEVELOPER_NUDGES = [EXCEPTION_LINE]
