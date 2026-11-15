from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MonitorNoteNudge(NudgeDeclaration):
    """The nudge processes.use_a_monitor."""

    key = "processes.use_a_monitor"
    type = NudgeType.STEERING
    text = "Do not poll output {output} again: set a Monitor on its wait"
    plural_text = 'do not ask again for outputs {output}: set a Monitor on each wait'
    id_field = "output"
