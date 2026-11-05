from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

AGENT_START_FAILED = NudgeDeclaration("agents.start_failed", NudgeType.STEERING, "agent:{agent} could not start: see journal agent terminal {agent}", wakes_agent=True)
LAUNCH_FAILURE_NUDGES = [AGENT_START_FAILED]


@dataclass(frozen=True)
class RecordAgentLaunchFailure(Command[None]):
    """Records that an agent's program could not start."""

    agent_id: int
