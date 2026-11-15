from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType
from core.modules.processes.support.block_conditions.output_read_since_block import OutputReadSinceBlock


class SilentRunBlockedNudge(NudgeDeclaration):
    """The nudge processes.silent_run_held."""

    key = "processes.silent_run_held"
    type = NudgeType.REFUSAL
    text = "Output {output} printed nothing for {seconds}s, CPU time {processor}: {hint}"
    required_command = "journal output read {output} --tail 5"
    closed_by = OutputReadSinceBlock
