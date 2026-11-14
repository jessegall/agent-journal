from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

EXCEPTION_LINE = NudgeDeclaration("developer.exception", NudgeType.STEERING, "journal-exception:{exception} was recorded: read it, then fix or report the cause", turn_limited=False, wakes_agent=True, plural_text="journal-exceptions {exception} were recorded", id_field="exception")
DEVELOPER_NUDGES = [EXCEPTION_LINE]
