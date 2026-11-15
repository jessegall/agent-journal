from dataclasses import dataclass

from engine.agent_stack.escalation import Escalation
from engine.agent_stack.reason import Reason
from engine.agent_stack.subject_reference import SubjectReference


@dataclass(frozen=True)
class OpenBlock:
    """A hold as a step judges it: an open agent_block row, or a plan of this step that has no row yet,
    with its scopes, whether each grace has passed, and the reason it refuses with."""

    nudge_key: str
    block_id: int | None
    reason: Reason
    scope_tools: bool
    scope_stop: bool
    tool_grace_passed: bool
    stop_grace_passed: bool
    is_strict: bool
    subject: SubjectReference | None = None

    def refuses_tools(self) -> bool:
        return self.scope_tools and self.tool_grace_passed

    def refuses_stop(self, escalation: Escalation | None) -> bool:
        deferred = escalation is not None and escalation.defers(self.block_id)
        return self.scope_stop and self.stop_grace_passed and not deferred

    def stop_refusal(self) -> Reason:
        return self.reason
