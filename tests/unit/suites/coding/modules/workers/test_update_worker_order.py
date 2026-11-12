from types import SimpleNamespace

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from suites.coding.modules.workers.commands.decide_behind_check.order_worker_update import OrderWorkerUpdate
from suites.coding.modules.workers.commands.update_worker.update_worker_subcommand import UpdateWorkerSubcommand
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState as State
from tests.unit.suites.coding.modules.workers.test_merger_update_subcommand import MAIN, MERGER, WORKER, Agents, Checks, ordered_by

OWN_RUN = object()


class Requests:
    def command(self, command, worker_id, argv, arguments, caller):
        return OWN_RUN


def asked(caller_id: int, named: int | None):
    subcommand = UpdateWorkerSubcommand(Requests(), None, Agents())
    return subcommand.command(SimpleNamespace(worker_id=named), SimpleNamespace(actor=Actor(caller_id, ActorType.AGENT), process_id=None))


def test_the_main_agent_naming_a_worker_orders_its_update():
    command = asked(MAIN, WORKER)
    assert isinstance(command, OrderWorkerUpdate) and command.worker_id == WORKER


def test_a_worker_naming_itself_or_no_one_updates_its_own_worktree():
    assert (asked(WORKER, WORKER), asked(WORKER, None)) == (OWN_RUN, OWN_RUN)


def test_a_worker_naming_another_worker_is_refused():
    with pytest.raises(Refusal, match="a worker updates only its own worktree"):
        asked(WORKER, 8)


def test_the_main_agent_orders_a_worker_with_no_check_open_and_one_is_opened_and_ordered():
    repository, _, nudger = ordered_by(MAIN, Checks())
    assert [row.state for row in repository.saved] == [State.OPEN, State.ORDERED] and nudger.sent[0][0] == WORKER


def test_the_merger_still_needs_an_open_check():
    with pytest.raises(Refusal, match="no open check for this worker"):
        ordered_by(MERGER, Checks())
