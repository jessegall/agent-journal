import io
import os

from core.base.actor import Actor, ActorType
from core.base.subcommand.caller import Caller
from core.base.cli.console import Console
from core.base.container import Container
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.registry.registry import Registry
from tests.core.base.samples import sync_sample
from tests.core.base.module.test_module_sync import ITEMS, synced

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


def test_a_stale_registry_is_refused(tmp_path):
    container = console(tmp_path)
    status = os.stat(sync_sample.__file__)
    os.utime(sync_sample.__file__, ns=(status.st_atime_ns, status.st_mtime_ns + 1_000_000))
    try:
        assert run(container, "item", "list") == (2, "the journal's modules changed: journal module sync\n")
    finally:
        os.utime(sync_sample.__file__, ns=(status.st_atime_ns, status.st_mtime_ns))
