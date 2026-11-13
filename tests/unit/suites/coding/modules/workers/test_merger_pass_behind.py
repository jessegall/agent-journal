from dataclasses import replace
from types import SimpleNamespace

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from suites.coding.modules.workers.commands.announce_behind_checks.announce_behind_checks import AnnounceBehindChecks
from suites.coding.modules.workers.commands.announce_behind_checks.announce_behind_checks_handler import AnnounceBehindChecksHandler
from suites.coding.modules.workers.commands.pass_behind_check.pass_behind_check import PassBehindCheck
from suites.coding.modules.workers.commands.pass_behind_check.pass_behind_check_handler import PassBehindCheckHandler
from suites.coding.modules.workers.commands.return_worker.return_worker import ReturnWorker
from suites.coding.modules.workers.commands.return_worker.return_worker_subcommand import ReturnWorkerSubcommand
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState as State
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.support.behind_decisions import BehindDecisions
from suites.coding.modules.workers.support.behind_nudges import BEHIND_CHOICES, BEHIND_PASSED
from tests.unit.suites.coding.modules.workers.support.test_behind_check_closing import WORKTREE
from tests.unit.suites.coding.modules.workers.commands.check_worktree_behind.test_check_worktree_behind import Lines, Rows, Settings
from tests.unit.suites.coding.modules.workers.commands.check_worktree_behind.test_check_worktree_behind import Queries as NoChecks
from tests.unit.suites.coding.modules.workers.test_merger_update_subcommand import MERGER, WORKER, Agents, Checks, Numbers, Repository, Visits, Worktrees
from suites.coding.modules.workers.support.behind_nudges import BEHIND_PASSED


class Waiting:
    def __init__(self, waits: bool) -> None:
        self.waits = waits

    def is_passable(self, worktree) -> bool:
        return self.waits


class StateWorktrees:
    def __init__(self, state: WorktreeState) -> None:
        self.state = state

    def worker_worktree(self, worker_id: int):
        return replace(WORKTREE, state=self.state)


def routed(state: WorktreeState, waits: bool):
    return ReturnWorkerSubcommand(StateWorktrees(state), Waiting(waits)).command(SimpleNamespace(worker_id=WORKER, reason="too large"), None)


def test_pass_on_a_cut_worktree_with_a_check_takes_the_behind_path_and_a_delivered_one_the_old_path():
    assert (type(routed(WorktreeState.CUT, True)), type(routed(WorktreeState.DELIVERED, True)), type(routed(WorktreeState.CUT, False))) == (PassBehindCheck, ReturnWorker, ReturnWorker)


def test_a_passed_check_goes_to_the_main_agent_by_its_number_and_no_worktree_state_moves():
    repository, visits, main_line = Repository(), Visits(), Lines()
    handler = PassBehindCheckHandler(Agents(), BehindDecisions(Worktrees(), Checks(State.OPEN), Numbers()), repository, visits, main_line, Numbers())
    command = PassBehindCheck(WORKER, "it is too large")
    handler.handle(command, SimpleNamespace(actor=Actor(MERGER, ActorType.AGENT)))
    assert [(row.state, row.decided_by) for row in repository.saved] == [(State.PASSED, MERGER)] and visits.closed == 1
    assert main_line.sent[0].key == BEHIND_PASSED.key


def test_with_the_merger_off_the_line_reaches_the_main_agent_and_names_the_facts_and_the_three_choices():
    inbox = Lines()
    AnnounceBehindChecksHandler(Rows(), NoChecks(), inbox, Settings(merger=False), Numbers()).handle(AnnounceBehindChecks((1,)), SimpleNamespace(timestamp=None))
    text = inbox.sent[0].text
    assert inbox.sent[0].key == BEHIND_CHOICES.key
    assert text.startswith("worker:999 is ")
