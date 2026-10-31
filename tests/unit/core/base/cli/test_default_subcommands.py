from argparse import ArgumentParser
from dataclasses import dataclass

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.subcommand.caller import Caller
from core.base.cli.default_subcommands import DefaultSubcommands
from core.base.subcommand.subcommand import Subcommand
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.command.bus import Bus
from core.base.container import Container
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.command.move_command import MoveCommand
from core.base.missing_rows import MissingRows
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.model.model import Model
from tests.unit.core.base.command.test_commands import ItemMake
from tests.unit.core.base.listener.test_commit_listener_runner import container_with
from tests.unit.core.base.model.test_lifecycle import ItemLifecycle, ItemState
from tests.unit.core.base.model.test_model import Item

CALLER = Caller(Actor(7, ActorType.AGENT))
NOTES = ("CREATE TABLE notes (id INTEGER PRIMARY KEY, item_id INTEGER NOT NULL REFERENCES items(id), amount INTEGER NOT NULL, version INTEGER NOT NULL,"
         " metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT")
NOTE = "INSERT INTO notes (item_id, amount, version, created_at, updated_at) VALUES (?, 5, 1, '2026-10-31T09:00:00+00:00', '2026-10-31T09:00:00+00:00')"


@dataclass(frozen=True, kw_only=True)
class Note(Model):
    model_name = "note"
    cli_name = "note"

    item_id: int
    amount: int


@pytest.fixture
def container(tmp_path) -> Container:
    built = container_with(tmp_path)
    for title in ("Dune", "Emma", "Ulysses"):
        built.get(Bus).run(ItemMake(title=title), CALLER.actor)
    built.get(Database).update(Statement(NOTES))
    for item_id in (1, 1, 2):
        built.get(Database).insert(Statement(NOTE, [item_id]))
    return built


def read(subcommand: ReadSubcommand[object], *argv: str) -> object:
    parser = ArgumentParser()
    subcommand.arguments(parser)
    return subcommand.read(parser.parse_args(list(argv)), CALLER)


def test_required_fields_are_arguments_and_optional_fields_are_flags(container):
    subcommand, parser = container.get(DefaultSubcommands).make(Item), ArgumentParser()
    subcommand.arguments(parser)
    assert subcommand.command(parser.parse_args(["Dune"]), CALLER).model_fields() == {"title": "Dune", "state": ItemState.OPEN}
    assert subcommand.command(parser.parse_args(["Dune", "--state", "paused"]), CALLER).model_fields() == {"title": "Dune", "state": ItemState.PAUSED}
    with pytest.raises(SystemExit):
        parser.parse_args([])


def test_the_built_command_is_the_nouns_make_command_and_runs_through_the_bus(container):
    subcommand, parser = container.get(DefaultSubcommands).make(Item), ArgumentParser()
    subcommand.arguments(parser)
    command = subcommand.command(parser.parse_args(["Middlemarch"]), CALLER)
    assert (command.model(), command.label()) == (Item, "ItemMake")
    assert container.get(Bus).run(command, CALLER.actor).id == 4


def test_show_reads_one_row_and_a_missing_id_is_refused_by_noun(container):
    single_row_subcommand = container.get(DefaultSubcommands).show(Item)
    item = read(single_row_subcommand, "2")
    assert isinstance(item, Item) and item.title == "Emma"
    with pytest.raises(MissingRows, match="item 9"):
        read(single_row_subcommand, "9")


def test_list_pages_newest_first_and_filters_by_enum_and_foreign_key(container):
    items = container.get(DefaultSubcommands).list(Item)
    assert [row.id for row in read(items, "--limit", "2").rows] == [3, 2]
    assert [row.id for row in read(items, "--limit", "2", "--page", "2").rows] == [1]
    assert [row.id for row in read(items, "--oldest", "--limit", "1").rows] == [1]
    assert read(items, "--state", "paused").rows == ()
    assert [row.id for row in read(container.get(DefaultSubcommands).list(Note), "--item", "1").rows] == [2, 1]


def run(container: Container, subcommand: Subcommand[object, object], *argv: str) -> object:
    parser = ArgumentParser()
    subcommand.arguments(parser)
    return container.get(Bus).run(subcommand.command(parser.parse_args(list(argv)), CALLER), CALLER.actor)


def test_edit_changes_only_the_fields_named(container):
    edit = container.get(DefaultSubcommands).edit(Item)
    item = run(container, edit, "2", "--title", "Persuasion")
    assert isinstance(item, Item) and (item.title, item.state, item.version) == ("Persuasion", ItemState.OPEN, 2)
    assert run(container, edit, "2").title == "Persuasion"


def test_edit_has_no_flag_for_the_state(container):
    with pytest.raises(SystemExit):
        run(container, container.get(DefaultSubcommands).edit(Item), "2", "--state", "paused")


def test_delete_removes_a_row_and_a_referenced_row_names_the_referring_table(container):
    removal_subcommand = container.get(DefaultSubcommands).delete(Item)
    run(container, removal_subcommand, "3")
    assert container.get(Queries).query(Item).count() == 2
    with pytest.raises(Refusal, match="still referred to by notes"):
        run(container, removal_subcommand, "1")


@dataclass(frozen=True)
class ItemClose(MoveCommand[Item]):
    move = ItemLifecycle.close
    title: str


def test_each_move_is_a_subcommand_and_a_typed_command_gives_its_fields_as_flags(container):
    pause, close = container.get(DefaultSubcommands).moves(Item, ["tests.unit.core.base.cli.test_default_subcommands:ItemClose"])
    assert (pause.name, close.name) == ("pause", "close")
    assert run(container, pause, "1").state == ItemState.PAUSED
    with pytest.raises(SystemExit):
        run(container, close, "2")
    item = run(container, close, "2", "--title", "Emma, closed")
    assert (item.state, item.title) == (ItemState.CLOSED, "Emma, closed")
