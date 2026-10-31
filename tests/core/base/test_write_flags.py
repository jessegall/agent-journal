from argparse import ArgumentParser

import pytest

from core.base.actor import Actor, ActorType
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
from core.base.registry.listener_entry import ListenerEntry, ListenerTiming
from core.base.registry.registry import Registry
from core.base.refusal import Refusal
from tests.core.base.harness import harness
from tests.core.base.listener_sample import ShelfCounter
from tests.core.base.test_commands import LoanMake

AGENT = Actor(7, ActorType.AGENT)


class NoDune(Guard):
    name = "loans.no-dune"
    event = "loan.create"

    def check(self, change: Change[Model]) -> None:
        raise Refusal("Dune is never lent")


class NoLoansToday(Guard):
    name = "loans.closed-today"
    event = "loan.*"
    short_flag = "today"

    def check(self, change: Change[Model]) -> None:
        raise Refusal("the library is closed today")


def registry() -> Registry:
    guards = (GuardEntry(NoDune.name, EventPattern(NoDune.event), DottedPath.class_path(NoDune), 1, ""),
              GuardEntry(NoLoansToday.name, EventPattern(NoLoansToday.event), DottedPath.class_path(NoLoansToday), 2, "today"))
    listeners = (ListenerEntry("loans.count", EventPattern("loan.create"), ListenerTiming.COMMIT, DottedPath.class_path(ShelfCounter), 1),)
    handlers = {DottedPath.class_path(MakeCommand).text: DottedPath.class_path(MakeHandler)}
    return Registry("abc", {}, handlers, {}, guards, listeners)


def test_explain_lists_every_refusal_and_listener_and_writes_nothing(tmp_path):
    container = harness(tmp_path, registry())
    explanation = container.get(Bus).explain(LoanMake(title="Dune"), AGENT)
    assert [refusal.guard for refusal in explanation.refusals] == ["loans.no-dune", "loans.closed-today"]
    assert [(event.event, event.listeners) for event in explanation.events] == [("loan.create", ("loans.count",))]
    assert container.get(Database).rows(Statement("SELECT count(*) FROM loans"))[0][0] == 0
    assert container.get(Database).rows(Statement("SELECT count(*) FROM events"))[0][0] == 0


def test_a_skipped_guard_and_a_short_flag_reach_the_context(tmp_path):
    container = harness(tmp_path, registry())
    flags, parser = WriteFlags(registry()), ArgumentParser()
    flags.add(parser)
    skipped = flags.skipped_guards(parser.parse_args(["--skip-guard", "loans.no-dune", "--today"]))
    assert skipped == frozenset({"loans.no-dune", "loans.closed-today"})
    loan = container.get(Bus).run(LoanMake(title="Dune"), AGENT, skipped)
    assert loan.title == "Dune"
    assert container.get(Database).rows(Statement("SELECT skipped_guards FROM events"))[0][0] == '["loans.closed-today", "loans.no-dune"]'


def test_without_explain_the_first_refusal_stops_the_command(tmp_path):
    with pytest.raises(GuardRefusal, match="Dune is never lent"):
        harness(tmp_path, registry()).get(Bus).run(LoanMake(title="Dune"), AGENT)
