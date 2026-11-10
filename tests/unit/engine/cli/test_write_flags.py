from argparse import ArgumentParser
from dataclasses import replace

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.change.event_pattern import EventPattern
from engine.cli.write_flags import WriteFlags
from engine.command.bus import Bus
from engine.command.handlers.make_handler import MakeHandler
from engine.command.make_command import MakeCommand
from engine.database.database import Database
from engine.database.statement import Statement
from engine.guard.guard import Guard
from engine.guard.errors.guard_refusal import GuardRefusal
from engine.model.model import Model
from engine.dotted_path.dotted_path import DottedPath
from engine.registry.guard_entry import GuardEntry
from engine.registry.listener_entry import ListenerEntry
from engine.enums.listener_timing import ListenerTiming
from engine.registry.registry import Registry
from engine.errors.refusal import Refusal
from tests.unit.engine.samples.sample_container import sample_container
from tests.unit.engine.samples.listener_sample import ShelfCounter
from tests.unit.engine.command.test_commands import MakeItem
from engine.change.created import Created
from engine.command.context import Context
from tests.unit.engine.model.test_model import Item
from engine.change.changed import Changed

AGENT = Actor(7, ActorType.AGENT)


class ForbiddenTitleGuard(Guard[Created[Item]]):
    name = "items.no-dune"

    def check(self, event: Created[Item], context: Context) -> None:
        raise Refusal("no item may be titled Dune")


class NoItemsToday(Guard[Changed[Item]]):
    name = "items.closed-today"
    short_flag = "today"

    def check(self, event: Changed[Item], context: Context) -> None:
        raise Refusal("no items are taken today")


def registry() -> Registry:
    guards = (GuardEntry(ForbiddenTitleGuard.name, EventPattern(ForbiddenTitleGuard.event), DottedPath.class_path(ForbiddenTitleGuard), 1, ""),
              GuardEntry(NoItemsToday.name, EventPattern(NoItemsToday.event), DottedPath.class_path(NoItemsToday), 2, "today"))
    listeners = [ListenerEntry("items.count", EventPattern("item.create"), ListenerTiming.COMMIT, DottedPath.class_path(ShelfCounter), 1)]
    handlers = {DottedPath.class_path(MakeCommand).text: DottedPath.class_path(MakeHandler)}
    return Registry("abc", {}, handlers, {}, guards, listeners)


def test_explain_lists_every_refusal_and_listener_and_is_readonly(tmp_path):
    container = sample_container(tmp_path, registry())
    explanation = container.get(Bus).explain(MakeItem(title="Dune"), AGENT)
    assert [refusal.guard for refusal in explanation.refusals] == ["items.no-dune", "items.closed-today"]
    assert [(event.event, event.listeners) for event in explanation.events] == [("item.create", ["items.count"])]
    assert container.get(Database).rows(Statement("SELECT count(*) FROM items"))[0][0] == 0
    assert container.get(Database).rows(Statement("SELECT count(*) FROM events"))[0][0] == 0


def test_a_skipped_guard_and_a_short_flag_reach_the_context(tmp_path):
    container = sample_container(tmp_path, registry())
    flags, parser = WriteFlags(registry()), ArgumentParser()
    flags.add(parser)
    skipped = flags.skipped_guards(parser.parse_args(["--skip-guard", "items.no-dune", "--today"]))
    assert skipped == frozenset({"items.no-dune", "items.closed-today"})
    item = container.get(Bus).run(MakeItem(title="Dune"), AGENT, skipped)
    assert item.title == "Dune"
    assert container.get(Database).rows(Statement("SELECT skipped_guards FROM events"))[0][0] == '["items.closed-today", "items.no-dune"]'


def test_without_explain_the_first_refusal_stops_the_command(tmp_path):
    with pytest.raises(GuardRefusal, match="no item may be titled Dune"):
        sample_container(tmp_path, registry()).get(Bus).run(MakeItem(title="Dune"), AGENT)


def test_a_shared_short_flag_skips_related_guards():
    current = registry()
    guards = (replace(current.guards[0], short_flag="today"), current.guards[1])
    flags, parser = WriteFlags(replace(current, guards=guards)), ArgumentParser()
    flags.add(parser)
    assert flags.skipped_guards(parser.parse_args(["--today"])) == frozenset({"items.no-dune", "items.closed-today"})
