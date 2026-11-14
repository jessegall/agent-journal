from dataclasses import dataclass

from engine.errors.refusal import Refusal
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.model.move import Move
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState
from suites.coding.modules.workers.models.lifecycles.behind_check_lifecycle import BehindCheckLifecycle

DECIDING_STATES = (BehindCheckState.OPEN, BehindCheckState.PASSED)
PASSABLE_STATES = (BehindCheckState.OPEN, BehindCheckState.ORDERED, BehindCheckState.CONFLICTED)


@dataclass(frozen=True, kw_only=True)
class WorktreeBehindCheck(EnvironmentScoped, Model):
    """One look at a worktree that fell behind its base branch: the base tip it was behind, by how many
    commits, where the decision stands, who decided it and why, how often the worker was reminded to update,
    and why its last update failed."""

    model_name = "worktree_behind_check"
    cli_name = "behind-check"
    lifecycle = BehindCheckLifecycle

    environment_id: int = 0
    worktree_id: int
    base_tip: str
    commits_lagging: int
    state: BehindCheckState = BehindCheckState.OPEN
    decider_id: int | None = None
    reason: str = ""
    reminders: int = 0
    failure: str = ""

    @classmethod
    def opened(cls, worktree_id: int, base_tip: str, commits_lagging: int) -> "WorktreeBehindCheck":
        return cls(worktree_id=worktree_id, base_tip=base_tip, commits_lagging=commits_lagging)

    def decision_text(self, decider: str) -> str:
        match self.state:
            case BehindCheckState.OPEN:
                return "waiting for a decision"
            case BehindCheckState.ORDERED:
                return f"update ordered by {decider}: {self.reason}"
            case BehindCheckState.PASSED:
                return f"passed to the main agent: {self.reason}"
            case BehindCheckState.IGNORED:
                return f"left alone by {decider}: {self.reason}"
            case BehindCheckState.CONFLICTED:
                return "the update clashed: settle the markers, then commit"
        return ""

    def is_undecided(self) -> bool:
        return self.state in DECIDING_STATES

    def ordered(self, decider_id: int, reason: str) -> "WorktreeBehindCheck":
        return self.after_move(BehindCheckLifecycle.order, decider_id=decider_id, reason=reason)

    def ignored(self, decider_id: int, reason: str) -> "WorktreeBehindCheck":
        return self.after_move(BehindCheckLifecycle.leave, decider_id=decider_id, reason=reason)

    def passed(self, decider_id: int, reason: str) -> "WorktreeBehindCheck":
        return self.after_move(BehindCheckLifecycle.escalate, decider_id=decider_id, reason=reason)

    def escalated(self, reason: str) -> "WorktreeBehindCheck":
        return self.after_move(BehindCheckLifecycle.escalate, decider_id=None, reason=reason)

    def conflicted(self) -> "WorktreeBehindCheck":
        return self.after_move(BehindCheckLifecycle.conflict)

    def updated(self) -> "WorktreeBehindCheck":
        return self.after_move(BehindCheckLifecycle.mark_updated)

    def ended(self) -> "WorktreeBehindCheck":
        return self.after_move(BehindCheckLifecycle.end)

    def failed(self, reason: str) -> "WorktreeBehindCheck":
        move = BehindCheckLifecycle.note_ordered_failure if self.state is BehindCheckState.ORDERED else BehindCheckLifecycle.note_open_failure
        return self.after_move(move, failure=reason)

    def reminded(self) -> "WorktreeBehindCheck":
        move = BehindCheckLifecycle.remind_clash if self.state is BehindCheckState.CONFLICTED else BehindCheckLifecycle.remind
        return self.after_move(move, reminders=self.reminders + 1)

    def paused(self) -> "WorktreeBehindCheck":
        return self.after_move(BehindCheckLifecycle.pause)

    def is_passable(self) -> bool:
        return self.state in PASSABLE_STATES

    def after_move(self, move: Move, **values: object) -> "WorktreeBehindCheck":
        if self.state not in move.sources:
            raise Refusal(f"behind check {self.id} is {self.state}, so it cannot {move.name.replace('_', ' ')}")
        return self.moved(move, **values)
