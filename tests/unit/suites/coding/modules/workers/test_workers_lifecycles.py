from dataclasses import replace
from datetime import datetime, timezone

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.change.change import Change
from engine.command.context import Context
from engine.guard.lifecycle_guard import LifecycleGuard
from core.base.model.state_book import StateBook
from core.base.model.model import Model
from engine.errors.refusal import Refusal
from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from tests.unit.engine.command.test_commands import MakeItem

WORKTREE = Worktree(id=1, version=1, session_agent_id=2, environment_id=1, task_id=1, creator_id=1, folder="/work/journal/.journal/worktrees/main/worker-2",
                    branch="journal/main/worker-2", base_branch="version-5")
PROOF = Proof(id=1, version=1, task_id=1, worktree_id=1, creator_id=2, point=1, text="cart.py:1, the cart total story")


def moved(old_row: Model, new_row: Model) -> Change[Model]:
    return Change(old_row, new_row, Context(Actor(2, ActorType.AGENT), Timestamp(datetime(2026, 10, 31, tzinfo=timezone.utc)), MakeItem(title="Dune"), frozenset()))


def guard_checked(old_row: Model, new_row: Model) -> None:
    change = moved(old_row, new_row)
    LifecycleGuard(StateBook()).check(change.typed_event(LifecycleGuard), change.context)


def refusal(old_row: Model, new_row: Model) -> str:
    with pytest.raises(Refusal) as raised:
        guard_checked(old_row, new_row)
    return raised.value.text


def test_worktree_moves():
    cut = WORKTREE.moved(WorktreeLifecycle.cut, base_commit="abc123")
    delivered = cut.moved(WorktreeLifecycle.deliver)
    merged = delivered.moved(WorktreeLifecycle.merge)
    for old_row, new_row in ((WORKTREE, cut), (cut, delivered), (delivered, merged), (merged, merged.moved(WorktreeLifecycle.remove))):
        guard_checked(old_row, new_row)


def test_worktree_move_refusal():
    merged = replace(WORKTREE, state=WorktreeState.MERGED)
    assert refusal(merged, merged.moved(WorktreeLifecycle.deliver)) == "worker-worktree 1 is merged, so it cannot deliver: from merged it can only go on with journal worker-worktree remove 1"
    assert refusal(WORKTREE, WORKTREE.moved(WorktreeLifecycle.merge)) == "worker-worktree 1 is new, so it cannot merge: from new it can only go on with journal worker-worktree cut 1"


def test_proof_move_refusal():
    checked = PROOF.moved(ProofLifecycle.check)
    guard_checked(PROOF, checked)
    guard_checked(checked, checked.moved(ProofLifecycle.short, shortfall="the rounding has no test"))
    assert refusal(checked, checked.moved(ProofLifecycle.revise)) == "proof 1 is checked, so it cannot revise: from checked it can only go on with journal proof short 1"
    assert refusal(PROOF, PROOF.moved(ProofLifecycle.revise)) == "proof 1 is shown, so it cannot revise: from shown it can only go on with journal proof queue 1, journal proof check 1, journal proof short 1"
