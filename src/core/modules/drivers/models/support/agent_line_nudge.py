from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

AGENT_LINE_AVAILABLE = NudgeDeclaration("drivers.agent_line_available", NudgeType.NOTICE, "agent-line:{line}", turn_limited=False, id_field="line", plural_text="agent-lines {line}")
