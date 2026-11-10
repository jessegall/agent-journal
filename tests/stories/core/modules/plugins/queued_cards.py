import json
from pathlib import Path
from threading import Event, Thread

import pytest

from core.base.command.bus import Bus
from core.base.database.database import Database
from engine.container.journal_container import synced_container
from engine.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.plugins.commands.add_plugin_output.add_plugin_output import AddPluginOutput
from core.modules.plugins.models.plugin_output import PluginOutput
from core.modules.plugins.ticks.plugin_card_reading import PluginCardReading
from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE, installed_story
from tests.stories.core.modules.plugins.support.notices import expect_plugin_notice
from tests.stories.support.story_checks import expect_value

CARD = {"kind": "state", "key": "queued", "label": "Queue was judged"}


def queued_card(story, name: str, fields: dict[str, object]) -> Path:
    queue = story.home.folder / "plugin-data" / "sample" / "queue"
    queue.mkdir(parents=True, exist_ok=True)
    path = queue / name
    path.write_text(json.dumps({"v": 1, "env": "main", "agent": story.agent.id, "cards": [CARD], "judged_ms": 1234, **fields}))
    return path


def test_a_queued_card_shows_on_the_tick_with_its_duration_before_any_hook(new_story):
    story = installed_story(new_story)
    story.hook("s-1", LISTING_SAMPLE)
    queued_card(story, "1.json", {})
    PluginCardReading()(story.container)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1 --columns figure,text", "sample: Queue was judged  1.2 s", actor=story.user)


def test_a_queued_line_still_reaches_the_agent_at_its_next_hook_after_the_card_showed(new_story):
    story = installed_story(new_story)
    story.hook("s-1", LISTING_SAMPLE)
    queued_card(story, "1.json", {"tell": "one sin in b.py"})
    PluginCardReading()(story.container)
    story.run_listeners()
    expect_plugin_notice(story, LISTING_SAMPLE, "[plugin sample] one sin in b.py")


def test_a_card_read_on_the_tick_is_not_kept_a_second_time_by_the_next_hook(new_story):
    story = installed_story(new_story)
    story.hook("s-1", LISTING_SAMPLE)
    queued_card(story, "1.json", {"tell": "one sin in b.py"})
    PluginCardReading()(story.container)
    story.hook("s-1", LISTING_SAMPLE)
    story.run_listeners()
    outcome = story.run("plugin record sample", actor=story.user)
    expect_value(outcome.output_text.count("Queue was judged"), 1)


def test_the_plugin_log_runs_oldest_first(new_story):
    story = installed_story(new_story)
    story.hook("s-1", LISTING_SAMPLE)
    queued_card(story, "1.json", {"cards": [{**CARD, "label": "the first sin"}]})
    PluginCardReading()(story.container)
    story.run_listeners()
    queued_card(story, "2.json", {"cards": [{**CARD, "label": "the second sin"}]})
    PluginCardReading()(story.container)
    story.run_listeners()
    log = story.run("plugin record sample", actor=story.user).output_text
    expect_value(log.index("the first sin") < log.index("the second sin"), True)


def test_a_queued_file_with_no_agent_waits_for_a_hook(new_story):
    story = installed_story(new_story)
    story.hook("s-1", LISTING_SAMPLE)
    queue = story.home.folder / "plugin-data" / "sample" / "queue"
    queue.mkdir(parents=True, exist_ok=True)
    (queue / "1.json").write_text(json.dumps({"v": 1, "env": "main", "cards": [CARD]}))
    PluginCardReading()(story.container)
    story.expect_no_text("chat-mark list --environment 1 --columns figure,text", "Queue was judged", actor=story.user)
    story.hook("s-1", LISTING_SAMPLE)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1 --columns figure,text", "sample: Queue was judged", actor=story.user)


def test_ticks_leave_a_line_only_file_untouched_until_its_hook(new_story, monkeypatch):
    story = installed_story(new_story)
    path = queued_card(story, "line.json", {"cards": [], "tell": "Read this next"})
    modified_at = path.stat().st_mtime_ns
    renamed = []
    original = Path.rename

    def record_rename(source, target):
        if source == path:
            renamed.append(target)
        return original(source, target)

    monkeypatch.setattr(Path, "rename", record_rename)
    PluginCardReading()(story.container)
    PluginCardReading()(story.container)
    story.expect_rows(path.stat().st_mtime_ns == modified_at, not renamed)
    expect_plugin_notice(story, LISTING_SAMPLE, "[plugin sample] Read this next")


def test_a_claim_left_by_a_stopped_server_restores_its_card_and_line(new_story):
    story = installed_story(new_story)
    path = queued_card(story, "stopped.json", {"tell": "The saved line"})
    path.rename(path.with_suffix(".claimed"))

    PluginCardReading()(story.container)
    story.run_listeners()

    story.expect_text("chat-mark list --environment 1", "Queue was judged", actor=story.user)
    expect_plugin_notice(story, LISTING_SAMPLE, "[plugin sample] The saved line")


def test_a_bad_agent_file_does_not_lose_good_cards_before_or_after_it(new_story):
    story = installed_story(new_story)
    queued_card(story, "first.json", {"cards": [{**CARD, "key": "first", "label": "First card"}]})
    bad = queued_card(story, "bad.json", {"agent": "not-an-agent"})
    queued_card(story, "last.json", {"cards": [{**CARD, "key": "last", "label": "Last card"}]})

    PluginCardReading()(story.container)
    story.run_listeners()

    story.expect_text("chat-mark list --environment 1", "First card", "Last card", actor=story.user)
    story.expect_rows(bad.with_suffix(".bad").exists())


class CardSaveFailed(RuntimeError):
    pass


def test_a_failed_card_save_keeps_the_card_and_every_unread_file(new_story, monkeypatch):
    story = installed_story(new_story)
    first = queued_card(story, "first.json", {"tell": "First line"})
    last = queued_card(story, "last.json", {"cards": [{**CARD, "key": "last", "label": "Last card"}]})
    original = Bus.run

    def fail_card_save(bus, command, *arguments, **options):
        if isinstance(command, AddPluginOutput):
            raise CardSaveFailed
        return original(bus, command, *arguments, **options)

    with monkeypatch.context() as patch:
        patch.setattr(Bus, "run", fail_card_save)
        with pytest.raises(CardSaveFailed):
            PluginCardReading()(story.container)
    story.expect_rows(first.exists() or first.with_suffix(".claimed").exists(), last.exists())

    PluginCardReading()(story.container)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1", "Queue was judged", "Last card", actor=story.user)
    expect_plugin_notice(story, LISTING_SAMPLE, "[plugin sample] First line")


def test_an_empty_card_list_saves_no_plugin_output(new_story):
    story = installed_story(new_story)
    queued_card(story, "empty.json", {"cards": []})
    prior_count = story.container.get(Queries).query(PluginOutput).count()

    PluginCardReading()(story.container)

    story.expect_rows(story.container.get(Queries).query(PluginOutput).count() == prior_count)


def test_a_hook_can_read_while_the_card_tick_takes_a_file_from_its_listing(new_story, monkeypatch):
    story = installed_story(new_story)
    path = queued_card(story, "race.json", {})
    original = Path.stat
    rename = Path.rename
    claimed = Event()
    raced = []
    failures = []

    def tick():
        container = synced_container(story.home)
        try:
            PluginCardReading()(container)
        except Exception as failure:
            failures.append(failure)
        finally:
            container.get(Database).close()

    def record_claim(source, target):
        renamed = rename(source, target)
        if source == path and Path(target).suffix == ".claimed":
            claimed.set()
        return renamed

    def run_tick(source, *arguments, **options):
        if source == path and not raced:
            thread = Thread(target=tick)
            raced.append(thread)
            thread.start()
            claimed.wait(5)
        return original(source, *arguments, **options)

    monkeypatch.setattr(Path, "stat", run_tick)
    monkeypatch.setattr(Path, "rename", record_claim)
    story.expect_hook_allowed("s-1", LISTING_SAMPLE)
    for thread in raced:
        thread.join(10)
        story.expect_rows(not thread.is_alive())
    story.run_listeners()
    story.expect_rows(claimed.is_set(), not failures, "FileNotFoundError" not in story.system_log_text())
    story.expect_text("chat-mark list --environment 1", "Queue was judged", actor=story.user)


def test_a_hook_does_not_recover_a_card_claim_while_the_tick_is_saving_it(new_story, monkeypatch):
    story = installed_story(new_story)
    queued_card(story, "active.json", {"tell": "After the card"})
    original = Bus.run
    visited = []

    def run_hook(bus, command, *arguments, **options):
        if isinstance(command, AddPluginOutput) and not visited:
            visited.append(True)
            query = story.container.get(Queries).query(AgentLine)
            previous = {row.id for row in query.all_rows()}
            story.expect_hook_allowed("s-1", LISTING_SAMPLE)
            expect_value({row.id for row in query.all_rows()}, previous)
        return original(bus, command, *arguments, **options)

    monkeypatch.setattr(Bus, "run", run_hook)
    PluginCardReading()(story.container)
    story.expect_rows(bool(visited))
    expect_plugin_notice(story, LISTING_SAMPLE, "[plugin sample] After the card")
