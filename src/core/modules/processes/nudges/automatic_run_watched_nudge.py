from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class AutomaticRunWatchedNudge(NudgeDeclaration):
    """The nudge processes.automatic_run_watched."""

    key = "processes.automatic_run_watched"
    type = NudgeType.STEERING
    text = "Output {output} is watched for you: keep working or stop; you are told when it ends, or started again if you stopped"
    plural_text = 'outputs {output} are watched for you: go on working or stop; you are told when they end, or started again if you stopped'
    id_field = "output"
