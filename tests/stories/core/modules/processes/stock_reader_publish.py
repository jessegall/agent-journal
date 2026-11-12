from dataclasses import replace

from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.stock_reader import STOCK_READERS, StockReader
from server.work.booting_work import BootingWork
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_start_publishes_stock_readers_and_keeps_project_edits(new_story, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('reader add pytest --title "Project tests"', "This is a stock reader. Apply the same fix to src/core/modules/processes/support/stock_reader.py, or file a task for it.", actor=story.agent)
    changed = tuple(replace(reader, title="New title") if reader.name in ("pytest", "vitest") else reader for reader in STOCK_READERS)
    new_reader = StockReader("new-reader", "new*", "New reader", "done")
    monkeypatch.setattr("core.modules.processes.commands.update_stock_readers.update_stock_readers_handler.STOCK_READERS", (*changed, new_reader))
    BootingWork().run(story.container)
    story.run_listeners()
    readers = story.container.get(ReaderQuery)
    story.expect_rows(readers.with_name("pytest").page(1, 1).rows[0].title == "Project tests",
                      readers.with_name("vitest").page(1, 1).rows[0].title == "New title",
                      readers.with_name("new-reader").page(1, 1).rows[0].title == "New reader")


def test_a_stock_row_whose_shipped_entry_is_gone_retires_unless_it_was_edited(new_story, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('reader add vitest --title "Our vitest"', actor=story.agent)
    kept = tuple(reader for reader in STOCK_READERS if reader.name not in ("jest", "vitest"))
    monkeypatch.setattr("core.modules.processes.commands.update_stock_readers.update_stock_readers_handler.STOCK_READERS", kept)
    BootingWork().run(story.container)
    story.run_listeners()
    readers = story.container.get(ReaderQuery)
    story.expect_rows(not readers.with_name("jest").exists(), readers.with_name("vitest").page(1, 1).rows[0].title == "Our vitest")


def test_a_frozen_stock_reader_whose_shipped_one_changed_is_named_to_the_main_agent_once(new_story, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('reader add vitest --title "Our vitest"', actor=story.agent)
    changed = tuple(replace(reader, summary="([0-9]+) tests passed") if reader.name == "vitest" else reader for reader in STOCK_READERS)
    monkeypatch.setattr("core.modules.processes.support.reading.catalogue_audit.STOCK_READERS", changed)
    monkeypatch.setattr("core.modules.processes.commands.update_stock_readers.update_stock_readers_handler.STOCK_READERS", changed)
    BootingWork().run(story.container)
    for _ in range(2):
        story.hook("s-1", HookSamples.session_start())
        story.run_listeners()
    listed = story.run(f"agent-line list --agent {story.agent.id}", actor=story.user).output_text
    story.expect_rows(listed.count("stock reader vitest fell behind the shipped one") == 1, detail=listed)
