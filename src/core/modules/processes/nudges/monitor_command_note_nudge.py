from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MonitorCommandNoteNudge(NudgeDeclaration):
    """The nudge processes.use_the_monitor_command."""

    key = "processes.use_the_monitor_command"
    type = NudgeType.STEERING
    text = "Do not poll output {output} again: wait for it; the wait ends when the run does"
    plural_text = 'do not ask again for outputs {output}: wait for each, which ends when its run does'
    id_field = "output"
