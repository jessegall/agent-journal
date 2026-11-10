import json
from collections import Counter

import pytest

from engine.database.database import Database
from engine.registry.registry import Registry
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from tests.stories.core.modules.plugins.support.event_modules import CLASHING, CLASHING_KEY, NOTE_CREATED, NOTES, NOTES_MOVED
from tests.stories.core.support.coding_fixtures import BuilderStarted

EXCLUDED_MODELS = ("plugin_delivery", "plugin_output", "plugin_queue_file")
METADATA_CHANGE = ".metadata"
ALL_FORMS = "guard listen commit"
SYSTEM_KEYS = ("core.journal.booting", "core.registry.sync", "core.upgrade.moved", "core.upgrade.finished", "core.settings.managed-hook.changed")


@pytest.fixture
def author(new_story):
    return new_story(fixture=BuilderStarted)


def key_rows(story) -> list[dict[str, object]]:
    outcome = story.run("event keys --json", actor=story.agent)
    assert outcome.code == 0, outcome.output_text
    return json.loads(outcome.output_text)["rows"]


def test_s1_each_line_holds_the_key_the_forms_and_the_log_name_sorted_by_key(author):
    author.expect_success("event keys --grep worktree", f"suites.coding.workers.worker_worktree.cut   {ALL_FORMS}   worker_worktree.cut   a worker worktree was cut", actor=author.agent)
    lines = author.run("event keys", actor=author.agent).output_text.splitlines()
    author.expect_rows(lines == sorted(lines), "core.drivers.hook_call.compact   commit   hook_call.compact   a hook call was compacted" in lines)
    author.expect_text("event keys --grep no-such-key", "no event has that key", actor=author.agent)


def test_s1_a_model_with_a_lifecycle_lists_each_move(author):
    keys = {row["key"] for row in key_rows(author)}
    missing = [move.name for move in TaskLifecycle.moves() if f"core.tasks.task.{move.name}" not in keys]
    author.expect_rows(not missing, "core.tasks.task.created" in keys, "core.tasks.task.updated" in keys, "core.tasks.task.deleted" in keys)


def test_s2_every_known_event_has_a_key_or_a_stated_reason_and_no_two_share_one(author):
    rows = key_rows(author)
    events = {row["event"] for row in rows}
    reasons = (METADATA_CHANGE, *(f"{model}." for model in EXCLUDED_MODELS))
    registered_events = Registry.read(author.container.get(Database)).events
    unkeyed_events = [event for event in registered_events if event not in events and not any(reason in event for reason in reasons)]
    duplicate_keys = [key for key, count in Counter(row["key"] for row in rows).items() if count > 1]
    author.expect_rows(bool(rows), not unkeyed_events, not duplicate_keys)


def test_s2_the_registry_of_the_real_modules_holds_their_keys(author):
    registry = Registry.read(author.container.get(Database))
    author.expect_rows(registry.event_key("worker_worktree.cut") == "suites.coding.workers.worker_worktree.cut", registry.event_key("task.create") == "core.tasks.task.created")
    author.expect_rows(registry.event_name("core.settings.managed-hook.changed") == "managed-hook.changed", registry.event_name("core.journal.booting") == "journal.booting")
    author.expect_rows(registry.event_key("plugin_delivery.create") == "", registry.event_key("task.metadata") == "")


def test_s2_a_module_that_adds_a_clashing_key_fails_at_sync(author):
    author.expect_sync_refusal(CLASHING, CLASHING_KEY)


def test_s3_a_listener_class_and_a_model_file_that_move_folders_change_no_key(author):
    author.expect_sync_success(NOTES)
    original_keys = author.run("event keys", actor=author.agent).output_text
    modules = json.loads(author.home.module_list.read_text())
    author.home.module_list.write_text(json.dumps([NOTES_MOVED if module == NOTES else module for module in modules]))
    code, _ = author.synced()
    author.expect_rows(code == 0)
    current_keys = author.run("event keys", actor=author.agent).output_text
    author.expect_rows(NOTE_CREATED in original_keys, original_keys == current_keys)
