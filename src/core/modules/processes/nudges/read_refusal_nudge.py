from engine.driver.nudge_declaration import NudgeDeclaration
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.support.reading_notices.exit_texts import ExitTexts
from engine.enums.nudge_type import NudgeType


class ReadRefusalNudge(NudgeDeclaration):
    """The nudge processes.reading_prevented."""

    key = "processes.reading_prevented"
    type = NudgeType.REFUSAL
    text = "output {output} has no proper reader: " + ExitTexts.template(PressureLevel.PREVENT.exits)
    full_text = True
