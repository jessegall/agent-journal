from dataclasses import dataclass
from core.modules.tasks.support.block_conditions.task_blocks_reviewed import TaskBlocksReviewed
from engine.command.command import Command
from engine.driver.agent_message import AgentMessage


@dataclass(frozen=True)
class BlockReviewAnswer:
    """One round of the blocked tasks' reminder: a line for each task due, the command that records the round, and
    the line and condition of the hold its third pass opens."""

    notices: tuple[AgentMessage, ...]
    record: Command[object] | None
    hold: tuple[AgentMessage, TaskBlocksReviewed] | None
