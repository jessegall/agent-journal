from dataclasses import dataclass

from engine.agent_stack.subject_reference import SubjectReference
from engine.driver.block_condition import BlockCondition
from engine.driver.nudge import Nudge
from engine.enums.closer_role import CloserRole


@dataclass(frozen=True)
class BlockPlan:
    """A hold a need source asks for, as pure data: the step judges the action against it as if it were open
    and opens its row in the same save."""

    nudge: Nudge
    condition: BlockCondition
    tool_check_key: str
    rank: str
    stop_check_key: str = ""
    members: tuple[int, ...] = ()
    tool_grace_uses: int = 0
    stop_grace_seconds: int = 0
    scope_tools: bool = True
    scope_stop: bool = False
    is_strict: bool = False
    closer_roles: tuple[CloserRole, ...] = ()
    subject: SubjectReference | None = None
    context_generation: int | None = None
    lifting_lines: tuple[str, ...] = ()
