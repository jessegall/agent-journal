from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType
from core.modules.processes.support.block_conditions.output_titled import OutputTitled


class RunNameNudge(NudgeDeclaration):
    """The nudge processes.name_the_run."""

    key = "processes.name_the_run"
    type = NudgeType.STEERING
    text = "Output {process} is titled by its raw command: give it a title"
    required_command = "journal output title {process}"
    closed_by = OutputTitled
