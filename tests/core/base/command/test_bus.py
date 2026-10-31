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
from core.base.registry.dotted_path import DottedPath
from core.base.registry.listener_entry import ListenerEntry, ListenerTiming
from core.base.registry.registry import Registry
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from tests.core.base.harness import harness
from tests.core.base.command.test_commands import ItemMake
from tests.core.base.model.test_lifecycle import ItemLifecycle
from tests.core.base.model.test_model import Item

AGENT = Actor(7, ActorType.AGENT)


@dataclass(frozen=True)
class ItemPair(Command[Item]):
    first: str
    second: str


class ItemPairHandler(Handler[ItemPair, Item]):
    command = ItemPair

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: ItemPair, context: Context) -> Item:
        self.repository.save(Item(title=command.first), context)
        return self.repository.save(Item(title=command.second), context)


@dataclass(frozen=True)
class BlockedItem(MakeCommand[Item]):
    title: str


class BlockedItemHandler(Handler[BlockedItem, Item]):
    command = BlockedItem

    def handle(self, command: BlockedItem, context: Context) -> Item:
        raise Refusal("no more items today")


@dataclass(frozen=True)
class ItemPause(MoveCommand[Item]):
    move = ItemLifecycle.pause


class TryARefusedItem(SaveListener):
    """After an item is item, tries a refused item and carries on when it is refused."""

    name = "items.try-refused"
    event = "item.create"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, change: Change[Model]) -> None:
        if change.row.id != 1:
            return
        try:
            self.bus.dispatch(BlockedItem(title="Emma"), change.context)
        except Refusal:
            return


def handlers(*pairs: tuple[type, type]) -> dict[str, DottedPath]:
    return {DottedPath.class_path(command).text: DottedPath.class_path(handler) for command, handler in pairs}


@pytest.fixture
def container(tmp_path):
    registry = Registry("abc", {}, handlers((MakeCommand, MakeHandler), (MoveCommand, MoveHandler), (ItemPair, ItemPairHandler), (BlockedItem, BlockedItemHandler)), {}, (),
                        (ListenerEntry(TryARefusedItem.name, EventPattern(TryARefusedItem.event), ListenerTiming.SAVE, DottedPath.class_path(TryARefusedItem), 1),))
    return harness(tmp_path, registry)


def titles(container) -> list[str]:
    return [row["title"] for row in container.get(Database).rows(Statement("SELECT title FROM items ORDER BY id"))]


def test_a_command_finds_its_handler_along_its_bases_and_a_more_specific_one_wins(container):
    assert container.get(Bus).run(ItemMake(title="Dune"), AGENT).title == "Dune"
    assert container.get(Bus).run(ItemPause(row_id=1), AGENT).state.value == "paused"
    with pytest.raises(Refusal, match="no more items today"):
        container.get(Bus).run(BlockedItem(title="Emma"), AGENT)


def test_every_row_a_command_writes_carries_one_moment(container):
    container.get(Bus).run(ItemPair(first="Dune", second="Emma"), AGENT)
    moments = {row["updated_at"] for row in container.get(Database).rows(Statement("SELECT updated_at FROM items"))}
    assert len(moments) == 1


def test_a_nested_refusal_a_listener_catches_leaves_the_outer_work(container):
    container.get(Bus).run(ItemMake(title="Dune"), AGENT)
    assert titles(container) == ["Dune"]


def test_a_refusal_at_the_top_writes_nothing(container):
    with pytest.raises(Refusal):
        container.get(Bus).run(ItemPair(first="Dune", second="Dune"), AGENT)
    assert titles(container) == []


def test_a_command_is_run_at_the_top_outside_a_transaction_and_nested_only_inside_one(container):
    bus = container.get(Bus)
    with container.get(Database).transaction():
        with pytest.raises(TransactionError, match="dispatch it"):
            bus.run(ItemMake(title="Dune"), AGENT)
    with pytest.raises(TransactionError, match="run it instead"):
        bus.dispatch(ItemMake(title="Dune"), Context(AGENT, bus.clock.moment(), ItemMake(title="Dune")))


def test_a_command_no_handler_carries_out_is_a_clear_fault(container):
    @dataclass(frozen=True)
    class Unhandled(Command[None]):
        pass

    with pytest.raises(MissingHandlerError, match="Unhandled"):
        container.get(Bus).run(Unhandled(), AGENT)
