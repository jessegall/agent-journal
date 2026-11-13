from types import SimpleNamespace

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from suites.coding.modules.workers.commands.decide_behind_check.leave_worker_behind import LeaveWorkerBehind
from suites.coding.modules.workers.commands.decide_behind_check.leave_worker_behind_handler import LeaveWorkerBehindHandler
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState as State
from suites.coding.modules.workers.support.behind_decisions import BehindDecisions
from tests.unit.suites.coding.modules.workers.test_merger_update_subcommand import MAIN, MERGER, OTHER, WORKER, Agents, Checks, Numbers, Repository, Visits, Worktrees


def ignoring_actor(actor_id: int, checks: Checks, worktrees: Worktrees | None = None) -> tuple[Repository, Visits]:
    repository, visits = Repository(), Visits()
    LeaveWorkerBehindHandler(Agents(), BehindDecisions(worktrees or Worktrees(), checks, Numbers()), repository, visits).handle(
        LeaveWorkerBehind(WORKER, "only the docs moved"), SimpleNamespace(actor=Actor(actor_id, ActorType.AGENT)))
    return repository, visits


def test_leaving_closes_the_check_as_left_with_the_reason_and_closes_the_visit():
    repository, visits = ignoring_actor(MERGER, Checks(State.OPEN))
    assert (repository.saved[0].state, repository.saved[0].reason, repository.saved[0].decider_id, visits.closed) == (State.IGNORED, "only the docs moved", MERGER, 1)


def test_the_main_agent_may_leave_a_passed_check_and_another_agent_is_refused():
    assert ignoring_actor(MAIN, Checks(State.PASSED))[0].saved[0].state is State.IGNORED
    with pytest.raises(Refusal, match="only the merger or the main agent"):
        ignoring_actor(OTHER, Checks(State.OPEN))


@pytest.mark.parametrize("checks, worktrees, refusal", [(Checks(State.ORDERED), None, "no open check for this worker"), (Checks(State.IGNORED), None, "no open check for this worker"),
                                                        (Checks(State.OPEN), Worktrees(matched=False), "no worker 999 with a worktree in this environment")])
def test_leaving_is_refused_with_no_check_to_decide_or_no_worktree(checks, worktrees, refusal):
    with pytest.raises(Refusal, match=refusal):
        ignoring_actor(MERGER, checks, worktrees)
