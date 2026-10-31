from argparse import ArgumentParser

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.change.event_pattern import EventPattern
from core.base.cli.write_flags import WriteFlags
from core.base.command.bus import Bus
from core.base.command.handlers.make_handler import MakeHandler
from core.base.command.make_command import MakeCommand
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.guard.guard import Guard
from core.base.guard_refusal import GuardRefusal
from core.base.model.model import Model
from core.base.registry.dotted_path import DottedPath
from core.base.registry.guard_entry import GuardEntry
from core.base.registry.listener_entry import ListenerEntry
from core.base.registry.listener_timing import ListenerTiming
from core.base.registry.registry import Registry
from core.base.refusal import Refusal
from tests.unit.core.base.sample_container import sample_container
from tests.unit.core.base.samples.listener_sample import ShelfCounter
from tests.unit.core.base.command.test_commands import MakeItem

AGENT = Actor(7, ActorType.AGENT)


class ForbiddenTitleGuard(Guard):
    name = "items.no-dune"
    event = "item.create"

    def check(self, change: Change[Model]) -> None:
        raise Refusal("no item may be titled Dune")


class NoItemsToday(Guard):
    name = "items.closed-today"
    event = "item.*"
    short_flag = "today"

    def check(self, change: Change[Model]) -> None:
        raise Refusal("no items are taken today")


def registry() -> Registry:
    guards = (GuardEntry(ForbiddenTitleGuard.name, EventPattern(ForbiddenTitleGuard.event), DottedPath.class_path(ForbiddenTitleGuard), 1, ""),
              GuardEntry(NoItemsToday.name, EventPattern(NoItemsToday.event), DottedPath.class_path(NoItemsToday), 2, "today"))
    listeners = [ListenerEntry("items.count", EventPattern("item.create"), ListenerTiming.COMMIT, DottedPath.class_path(ShelfCounter), 1)]
    handlers = {DottedPath.class_path(MakeCommand).text: DottedPath.class_path(MakeHandler)}
    return Registry("abc", {}, handlers, {}, guards, listeners)


def test_explain_lists_every_refusal_and_listener_and_writes_nothing(tmp_path):
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
