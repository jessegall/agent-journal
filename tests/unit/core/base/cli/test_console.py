import io
import os

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.subcommand.caller import Caller
from core.base.cli.console import Console
from core.base.container import Container
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.registry.registry import Registry
from tests.unit.core.base.samples.module_copy import items_module_copy
from tests.unit.core.base.module.test_module_sync import ITEMS, synced

CALLER = Caller(Actor(1, ActorType.CORE))


def console(tmp_path) -> Container:
    container = synced(JournalHome(tmp_path), ITEMS)
    container.bind(Registry, Registry.read(container.get(Database)))
    return container


def run(container: Container, *argv: str) -> tuple[int, str]:
    stream = io.StringIO()
    code = container.get(Console).run(list(argv), CALLER, stream)
    return code, stream.getvalue()


def test_a_command_that_works_exits_with_zero_and_prints_the_row(tmp_path):
    code, output_text = run(console(tmp_path), "item", "make", "Dune")
    assert code == 0 and "title: Dune\n" in output_text


def test_a_refusal_exits_with_one_and_is_recorded(tmp_path):
    container = console(tmp_path)
    run(container, "item", "make", "Dune")
    assert run(container, "item", "make", "Dune") == (1, "an item with that title exists already\n")
    assert [tuple(row) for row in container.get(Database).rows(Statement("SELECT command, reason FROM refusals"))] == [("item make", "an item with that title exists already")]


def test_a_usage_error_exits_with_two(tmp_path):
    assert run(console(tmp_path), "shelf", "list")[0] == 2
    assert run(console(tmp_path), "item", "make")[0] == 2


def test_an_unexpected_error_exits_with_three_and_is_written_to_the_error_log(tmp_path):
    container = console(tmp_path)
    container.get(Database).update(Statement("DROP TABLE items"))
    code, output_text = run(container, "item", "list")
    assert code == 3 and "OperationalError" in output_text
    assert JournalHome(tmp_path).error_log.exists()


def test_a_stale_registry_is_refused(tmp_path, monkeypatch):
    module_path, copy = items_module_copy(tmp_path, monkeypatch)
    container = synced(JournalHome(tmp_path), module_path)
    container.bind(Registry, Registry.read(container.get(Database)))
    status = os.stat(copy)
    os.utime(copy, ns=(status.st_atime_ns, status.st_mtime_ns + 1_000_000))
    assert run(container, "item", "list") == (2, "the journal's modules changed: journal module sync\n")


class BrokenListenerRunner(CommitListenerRunner):
    """Stands in for a listener run that fails once a write is committed."""

    def __init__(self) -> None:
        self.runs = 0

    def run(self) -> None:
        self.runs += 1
        if self.runs > 1:
            raise RuntimeError("a listener broke after the commit")


def test_an_error_after_the_commit_is_logged_and_the_saved_write_still_exits_with_zero(tmp_path):
    container = console(tmp_path)
    container.bind(CommitListenerRunner, BrokenListenerRunner())
    code, output_text = run(container, "item", "make", "Dune")
    assert code == 0 and "title: Dune" in output_text
    assert "a listener broke after the commit" in JournalHome(tmp_path).error_log.read_text()


class CountedRuns(CommitListenerRunner):
    """Counts the listener runs a command starts."""

    def __init__(self) -> None:
        self.runs = 0

    def run(self) -> None:
        self.runs += 1


def test_a_read_runs_no_listeners_and_a_write_runs_them_before_and_after(tmp_path):
    container = console(tmp_path)
    runner = CountedRuns()
    container.bind(CommitListenerRunner, runner)
    run(container, "item", "list")
    assert runner.runs == 0
    run(container, "item", "make", "Dune")
    assert runner.runs == 2


def test_an_abbreviated_flag_is_a_usage_error_and_the_full_flag_works(tmp_path):
    container = console(tmp_path)
    assert run(container, "item", "make", "Dune", "--env", "main")[0] == 2
    assert run(container, "item", "make", "Dune", "--skip", "items.paused-guard")[0] == 2
    assert run(container, "item", "make", "Dune", "--skip-guard", "items.paused-guard")[0] == 0
