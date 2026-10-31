from dataclasses import dataclass

import pytest

from core.base.actor import Actor, ActorType
from core.base.change.change import Change
from core.base.change.event_pattern import EventPattern
from core.base.command.bus import Bus, MissingHandlerError, TransactionError
from core.base.command.command import Command
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.command.handlers.make_handler import MakeHandler
from core.base.command.handlers.move_handler import MoveHandler
from core.base.command.make_command import MakeCommand
from core.base.command.move_command import MoveCommand
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.module.dotted_path import DottedPath
from core.base.module.listener_entry import ListenerEntry, ListenerTiming
from core.base.module.registry import Registry
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from tests.core.base.harness import harness
from tests.core.base.test_commands import LoanMake
from tests.core.base.test_lifecycle import LoanLifecycle
from tests.core.base.test_model import Loan

AGENT = Actor(7, ActorType.AGENT)


@dataclass(frozen=True)
class LoanPair(Command[Loan]):
    first: str
    second: str


class LoanPairHandler(Handler[LoanPair, Loan]):
    command = LoanPair

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: LoanPair, context: Context) -> Loan:
        self.repository.save(Loan(title=command.first), context)
        return self.repository.save(Loan(title=command.second), context)


@dataclass(frozen=True)
class LoanRefused(MakeCommand[Loan]):
    title: str


class LoanRefusedHandler(Handler[LoanRefused, Loan]):
    command = LoanRefused

    def handle(self, command: LoanRefused, context: Context) -> Loan:
        raise Refusal("no more loans today")


@dataclass(frozen=True)
class LoanOverdue(MoveCommand[Loan]):
    move = LoanLifecycle.overdue


class TryARefusedLoan(SaveListener):
    """After a loan is made, tries a refused loan and carries on when it is refused."""

    name = "loans.try-refused"
    event = "loan.create"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, change: Change[Model]) -> None:
        if change.row.id != 1:
            return
        try:
            self.bus.dispatch(LoanRefused(title="Emma"), change.context)
        except Refusal:
            return


def handlers(*pairs: tuple[type, type]) -> dict[str, DottedPath]:
    return {DottedPath.class_path(command).text: DottedPath.class_path(handler) for command, handler in pairs}


@pytest.fixture
def container(tmp_path):
    registry = Registry("abc", {}, handlers((MakeCommand, MakeHandler), (MoveCommand, MoveHandler), (LoanPair, LoanPairHandler), (LoanRefused, LoanRefusedHandler)), {}, (),
                        (ListenerEntry(TryARefusedLoan.name, EventPattern(TryARefusedLoan.event), ListenerTiming.SAVE, DottedPath.class_path(TryARefusedLoan), 1),))
    return harness(tmp_path, registry)


def titles(container) -> list[str]:
    return [row["title"] for row in container.get(Database).rows(Statement("SELECT title FROM loans ORDER BY id"))]


def test_a_command_finds_its_handler_along_its_bases_and_a_more_specific_one_wins(container):
    assert container.get(Bus).run(LoanMake(title="Dune"), AGENT).title == "Dune"
    assert container.get(Bus).run(LoanOverdue(row_id=1), AGENT).state.value == "late"
    with pytest.raises(Refusal, match="no more loans today"):
        container.get(Bus).run(LoanRefused(title="Emma"), AGENT)


def test_every_row_a_command_writes_carries_one_moment(container):
    container.get(Bus).run(LoanPair(first="Dune", second="Emma"), AGENT)
    moments = {row["updated_at"] for row in container.get(Database).rows(Statement("SELECT updated_at FROM loans"))}
    assert len(moments) == 1


def test_a_nested_refusal_a_listener_catches_leaves_the_outer_work(container):
    container.get(Bus).run(LoanMake(title="Dune"), AGENT)
    assert titles(container) == ["Dune"]


def test_a_refusal_at_the_top_writes_nothing(container):
    with pytest.raises(Refusal):
        container.get(Bus).run(LoanPair(first="Dune", second="Dune"), AGENT)
    assert titles(container) == []


def test_a_command_is_run_at_the_top_outside_a_transaction_and_nested_only_inside_one(container):
    bus = container.get(Bus)
    with container.get(Database).transaction():
        with pytest.raises(TransactionError, match="dispatch it"):
            bus.run(LoanMake(title="Dune"), AGENT)
    with pytest.raises(TransactionError, match="run it instead"):
        bus.dispatch(LoanMake(title="Dune"), Context(AGENT, bus.clock.moment(), LoanMake(title="Dune")))


def test_a_command_no_handler_carries_out_is_a_clear_fault(container):
    @dataclass(frozen=True)
    class Unhandled(Command[None]):
        pass

    with pytest.raises(MissingHandlerError, match="Unhandled"):
        container.get(Bus).run(Unhandled(), AGENT)
