from dataclasses import dataclass

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.change.event_pattern import EventPattern
from engine.command.bus import Bus
from engine.command.missing_handler_error import MissingHandlerError
from engine.command.transaction_error import TransactionError
from engine.command.command import Command
from engine.command.outside_runs import MAX_ROUNDS, OutsideRuns
from engine.command.outside_turn import OutsideTurn
from engine.command.script_policy import ScriptPolicy
from core.base.database.kept_rows import KeptRows
from engine.query.queries import Queries
from engine.command.context import Context
from engine.command.handler import Handler
from engine.command.handlers.make_handler import MakeHandler
from engine.command.handlers.move_handler import MoveHandler
from engine.command.make_command import MakeCommand
from engine.command.move_command import MoveCommand
from core.base.database.database import Database
from core.base.database.statement import Statement
from engine.listener.save_listener import SaveListener
from engine.model.model import Model
from engine.dotted_path.dotted_path import DottedPath
from core.base.registry.listener_entry import ListenerEntry
from core.base.registry.listener_timing import ListenerTiming
from core.base.registry.registry import Registry
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from tests.unit.core.base.sample_container import sample_container
from tests.unit.engine.command.test_commands import MakeItem
from tests.unit.engine.model.test_lifecycle import ItemLifecycle
from tests.unit.engine.model.test_model import Item
from engine.change.created import Created

AGENT = Actor(7, ActorType.AGENT)
ROUNDS: list[int] = []
WORK_RUNS: list[str] = []
CACHED_COUNTS: list[int] = []
RECORDED_CONTEXTS: list[Context] = []


@dataclass(frozen=True)
class PreparedItem(Command[Item]):
    title: str


class PreparedItemHandler(Handler[PreparedItem, Item]):
    command = PreparedItem

    def prepare(self, command: PreparedItem, actor: Actor) -> None:
        return None


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


class TryDeclinedItem(SaveListener[Created[Item]]):
    """After an item is made, tries to make a refused one and carries on when it is refused."""

    name = "items.try-refused"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Created[Item], context: Context) -> None:
        if event.row.id != 1:
            return
        try:
            self.bus.dispatch(BlockedItem(title="Emma"), context)
        except Refusal:
            return


class OutsideTestWork:
    """A stand-in for a plugin's script: it counts its runs and leaves one answer."""

    def __init__(self, turn: OutsideTurn) -> None:
        self.turn = turn

    def label(self) -> str:
        return "asked work"

    def run(self, runs: OutsideRuns) -> None:
        WORK_RUNS.append(self.turn.log_name)
        runs.record(self.turn, ["allowed"])


@dataclass(frozen=True)
class OutsideWorkCreateItem(Command[Item]):
    title: str


class OutsideWorkCreateItemHandler(Handler[OutsideWorkCreateItem, Item]):
    """Saves an item and asks for outside work once."""

    command = OutsideWorkCreateItem

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: OutsideWorkCreateItem, context: Context) -> Item:
        ROUNDS.append(context.external_runs.rounds)
        item = self.repository.save(Item(title=command.title), context)
        turn = context.external_runs.turn("guard", "item.create")
        if not turn.has_answers and not context.external_runs.closed:
            raise context.external_runs.rollback(OutsideTestWork(turn))
        return item


@dataclass(frozen=True)
class EndlessItem(Command[Item]):
    title: str


class EndlessItemHandler(Handler[EndlessItem, Item]):
    """Asks for new outside work each round, with no answer ever holding."""

    command = EndlessItem

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: EndlessItem, context: Context) -> Item:
        ROUNDS.append(context.external_runs.rounds)
        item = self.repository.save(Item(title=command.title), context)
        if not context.external_runs.closed:
            raise context.external_runs.rollback(EndlessWork())
        return item


class EndlessWork:
    def label(self) -> str:
        return "endless work"

    def run(self, runs: OutsideRuns) -> None:
        WORK_RUNS.append("endless")


@dataclass(frozen=True)
class CreateSingleItem(Command[Item]):
    title: str


class CreateSingleItemHandler(EndlessItemHandler):
    command = CreateSingleItem
    runs_once = True


@dataclass(frozen=True)
class SwallowingItem(Command[Item]):
    title: str


class SwallowingItemHandler(OutsideWorkCreateItemHandler):
    """Catches everything, as a broad except in a handler does."""

    command = SwallowingItem

    def handle(self, command: SwallowingItem, context: Context) -> Item:
        try:
            return super().handle(command, context)
        except Exception:
            return Item(id=0, title=command.title)


@dataclass(frozen=True)
class KeptItem(Command[Item]):
    title: str


class KeptItemHandler(OutsideWorkCreateItemHandler):
    """Reads the items through kept rows at the start of each round."""

    command = KeptItem

    def __init__(self, repository: Repository, kept: KeptRows, queries: Queries) -> None:
        super().__init__(repository)
        self.kept, self.queries = kept, queries

    def handle(self, command: KeptItem, context: Context) -> Item:
        CACHED_COUNTS.append(self.kept.read("items", self.queries.query(Item).count, name="items.count"))
        item = super().handle(command, context)
        CACHED_COUNTS.append(self.kept.read("items", self.queries.query(Item).count, name="items.count"))
        return item


@dataclass(frozen=True)
class OutsideWorkCreateItems(Command[Item]):
    lock = False
    first: str
    second: str


class OutsideWorkCreateItemsHandler(Handler[OutsideWorkCreateItems, Item]):
    """Runs two commands of its own, as a handler with outside work between them does."""

    command = OutsideWorkCreateItems

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, command: OutsideWorkCreateItems, context: Context) -> Item:
        self.bus.run(MakeItem(title=command.first), context.actor)
        return self.bus.run_with_context(OutsideWorkCreateItem(command.second), context)


@dataclass(frozen=True)
class RecordContext(Command[int]):
    pass


class RecordContextHandler(Handler[RecordContext, int]):
    command = RecordContext

    def handle(self, command: RecordContext, context: Context) -> int:
        RECORDED_CONTEXTS.append(context)
        return 0


@dataclass(frozen=True)
class Passed(Command[int]):
    lock = False


class PassedHandler(Handler[Passed, int]):
    command = Passed

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, command: Passed, context: Context) -> int:
        return self.bus.run_with_context(RecordContext(), context)


@dataclass(frozen=True)
class CreateNestedSingleItem(Command[Item]):
    title: str


class CreateNestedSingleItemHandler(CreateSingleItemHandler):
    command = CreateNestedSingleItem


@dataclass(frozen=True)
class NestedCreateItem(Command[Item]):
    title: str


class NestedCreateItemHandler(Handler[NestedCreateItem, Item]):
    """Dispatches a single-run command before requesting outside work."""

    command = NestedCreateItem

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, command: NestedCreateItem, context: Context) -> Item:
        ROUNDS.append(context.external_runs.rounds)
        item = self.bus.dispatch(CreateNestedSingleItem(command.title), context)
        if not context.external_runs.closed:
            raise context.external_runs.rollback(EndlessWork())
        return item


def handlers(*pairs: tuple[type, type]) -> dict[str, DottedPath]:
    return {DottedPath.class_path(command).text: DottedPath.class_path(handler) for command, handler in pairs}


@pytest.fixture
def container(tmp_path):
    registry = Registry("abc", {}, handlers((PreparedItem, PreparedItemHandler), (MakeCommand, MakeHandler), (MoveCommand, MoveHandler), (ItemPair, ItemPairHandler), (BlockedItem, BlockedItemHandler)), {}, (),
                        [ListenerEntry(TryDeclinedItem.name, EventPattern(TryDeclinedItem.event), ListenerTiming.SAVE, DottedPath.class_path(TryDeclinedItem), 1)])
    return sample_container(tmp_path, registry)


@pytest.fixture
def external_container(tmp_path):
    for records in (ROUNDS, WORK_RUNS, CACHED_COUNTS, RECORDED_CONTEXTS):
        records.clear()
    pairs = handlers((MakeCommand, MakeHandler), (OutsideWorkCreateItem, OutsideWorkCreateItemHandler), (EndlessItem, EndlessItemHandler), (CreateSingleItem, CreateSingleItemHandler), (SwallowingItem, SwallowingItemHandler),
                     (KeptItem, KeptItemHandler), (OutsideWorkCreateItems, OutsideWorkCreateItemsHandler), (RecordContext, RecordContextHandler), (Passed, PassedHandler), (CreateNestedSingleItem, CreateNestedSingleItemHandler), (NestedCreateItem, NestedCreateItemHandler))
    container = sample_container(tmp_path, Registry("abc", {}, pairs, {}, (), ()))
    container.bind(ScriptPolicy, ScriptPolicy(guards_run=True))
    return container


def titles(container) -> list[str]:
    return [row["title"] for row in container.get(Database).rows(Statement("SELECT title FROM items ORDER BY id"))]


def test_a_command_finds_its_handler_along_its_bases_and_a_more_specific_one_wins(container):
    assert container.get(Bus).run(MakeItem(title="Dune"), AGENT).title == "Dune"
    assert container.get(Bus).run(ItemPause(row_id=1), AGENT).state.value == "paused"
    with pytest.raises(Refusal, match="no more items today"):
        container.get(Bus).run(BlockedItem(title="Emma"), AGENT)


def test_every_row_a_command_writes_carries_one_timestamp(container):
    container.get(Bus).run(ItemPair(first="Dune", second="Emma"), AGENT)
    timestamps = {row["updated_at"] for row in container.get(Database).rows(Statement("SELECT updated_at FROM items"))}
    assert len(timestamps) == 1


def test_a_nested_refusal_a_listener_catches_leaves_the_outer_work(container):
    container.get(Bus).run(MakeItem(title="Dune"), AGENT)
    assert titles(container) == ["Dune"]


def test_a_refusal_at_the_top_is_readonly(container):
    with pytest.raises(Refusal):
        container.get(Bus).run(ItemPair(first="Dune", second="Dune"), AGENT)
    assert titles(container) == []


def test_a_command_is_run_at_the_top_outside_a_transaction_and_nested_only_inside_one(container):
    bus = container.get(Bus)
    with container.get(Database).transaction():
        with pytest.raises(TransactionError, match="dispatch it"):
            bus.run(MakeItem(title="Dune"), AGENT)
    item = bus.dispatch(MakeItem(title="Dune"), Context(AGENT, bus.clock.timestamp(), MakeItem(title="Dune")))
    assert item.title == "Dune"


def test_a_command_no_handler_carries_out_is_a_clear_fault(container):
    @dataclass(frozen=True)
    class Unhandled(Command[None]):
        pass

    with pytest.raises(MissingHandlerError, match="Unhandled"):
        container.get(Bus).run(Unhandled(), AGENT)


def test_a_handler_can_run_again_unless_it_says_it_runs_once():
    assert Handler.runs_once is False


def test_a_command_that_rolls_back_once_runs_twice_and_saves_once(external_container):
    item = external_container.get(Bus).run(OutsideWorkCreateItem("Dune"), AGENT)
    assert ROUNDS == [1, 2] and WORK_RUNS == ["item.create"]
    assert titles(external_container) == ["Dune"] and item.title == "Dune"


def test_the_round_past_the_limit_goes_closed_and_the_command_commits(external_container):
    external_container.get(Bus).run(EndlessItem("Dune"), AGENT)
    assert len(ROUNDS) == MAX_ROUNDS + 1 and len(WORK_RUNS) == MAX_ROUNDS
    assert titles(external_container) == ["Dune"]


def test_a_closed_run_never_raises_and_its_handler_runs_once(external_container):
    external_container.get(Bus).run(CreateSingleItem("Dune"), AGENT)
    assert ROUNDS == [1] and WORK_RUNS == []
    assert titles(external_container) == ["Dune"]


def test_explain_never_calls_the_work(external_container):
    external_container.get(Bus).explain(EndlessItem("Dune"), AGENT)
    assert WORK_RUNS == [] and titles(external_container) == []


def test_a_handler_that_swallows_the_rollback_is_caught(external_container):
    external_container.get(Bus).run(SwallowingItem("Dune"), AGENT)
    assert ROUNDS == [1, 2] and WORK_RUNS == ["item.create"]
    assert titles(external_container) == ["Dune"]


def test_a_rolled_back_row_is_not_read_back_from_kept_rows(external_container):
    external_container.get(Bus).run(KeptItem("Dune"), AGENT)
    assert CACHED_COUNTS == [0, 0, 1]


def test_a_locked_command_inside_an_unlocked_one_runs_as_it_does_at_the_top(external_container):
    external_container.get(Bus).run(OutsideWorkCreateItems("First", "Second"), AGENT)
    assert ROUNDS == [1, 2] and WORK_RUNS == ["item.create"]
    assert titles(external_container) == ["First", "Second"]


def test_a_nested_command_keeps_the_skipped_guards_and_the_plugin_script(external_container):
    external_container.get(Bus).run(Passed(), AGENT, frozenset({"plugins.event-guard"}), plugin_script="see.sh")
    context = RECORDED_CONTEXTS[0]
    assert context.skipped_guards == {"plugins.event-guard"} and context.external_runs.is_plugin_script


def test_dispatching_a_command_that_runs_once_closes_the_rest_of_the_command(external_container):
    external_container.get(Bus).run(NestedCreateItem("Dune"), AGENT)
    assert ROUNDS == [1, 1] and WORK_RUNS == []
    assert titles(external_container) == ["Dune"]


def test_a_container_nobody_opened_runs_no_outside_work_and_says_why(external_container):
    external_container.bind(ScriptPolicy, ScriptPolicy())
    external_container.instances.pop(Bus, None)
    external_container.get(Bus).run(EndlessItem("Dune"), AGENT)
    assert ROUNDS == [1] and WORK_RUNS == []


def test_a_dispatch_refuses_a_handler_with_a_prepare_step(container):
    bus = container.get(Bus)
    command = PreparedItem("Dune")
    with container.get(Database).transaction(), pytest.raises(TransactionError, match="has a prepare step"):
        bus.dispatch(command, Context(AGENT, bus.clock.timestamp(), command))


def test_lock_is_command_metadata_and_defaults_to_true():
    assert MakeItem.lock is True
    assert OutsideWorkCreateItems.lock is False
    assert OutsideWorkCreateItems("First", "Second").field_values(()) == {"first": "First", "second": "Second"}
