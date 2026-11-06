import json
from collections import Counter

import pytest

from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.modules.drivers.models.hook_call import HookCall
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.modules.plugins.support.event_modules import CLASHING, CLASHING_KEY, NOTE_CREATED, NOTES, NOTES_MOVED
from tests.stories.core.support.coding_fixtures import BuilderStarted

NO_KEY_MODELS = ("plugin_delivery", "plugin_output", "plugin_queue_file")
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


def test_s1_an_author_finds_the_keys_of_a_subject_with_their_forms_and_log_names(author):
    author.expect_text("event keys --grep worktree", "suites.coding.workers.worker_worktree.created", ALL_FORMS, "worker_worktree.create",
                       "suites.coding.workers.worker_worktree.cut", "worker_worktree.cut", actor=author.agent)
    author.expect_no_text("event keys --grep worktree", "core.tasks.task.created", actor=author.agent)


def test_s1_each_line_holds_the_key_the_forms_and_the_log_name_sorted_by_key(author):
    author.expect_success("event keys --grep worktree", f"suites.coding.workers.worker_worktree.cut   {ALL_FORMS}   worker_worktree.cut", actor=author.agent)
    lines = author.run("event keys", actor=author.agent).output_text.splitlines()
    author.expect_rows(lines == sorted(lines), "core.drivers.hook_call.compact   commit   hook_call.compact" in lines)
    author.expect_text("event keys --grep no-such-key", "no event has that key", actor=author.agent)


def test_s1_a_model_with_a_lifecycle_lists_each_move(author):
    keys = {row["key"] for row in key_rows(author)}
    missing = [move.name for move in TaskLifecycle.moves() if f"core.tasks.task.{move.name}" not in keys]
    author.expect_rows(not missing, "core.tasks.task.created" in keys, "core.tasks.task.updated" in keys, "core.tasks.task.deleted" in keys)


def test_s1_a_model_with_change_names_lists_each_name(author):
    keys = {row["key"]: row for row in key_rows(author)}
    for name in HookCall.change_names:
        assert keys[f"core.drivers.hook_call.{name}"]["forms"] == ["commit"], keys[f"core.drivers.hook_call.{name}"]


def test_s1_metadata_is_not_listed(author):
    rows = key_rows(author)
    author.expect_rows(bool(rows), not [row for row in rows if str(row["key"]).endswith("metadata") or str(row["event"]).endswith(METADATA_CHANGE)])


def test_s1_a_system_event_lists_only_the_commit_form(author):
    keys = {row["key"]: row for row in key_rows(author)}
    for key in SYSTEM_KEYS:
        assert keys[key]["forms"] == ["commit"], keys[key]


def test_s2_every_known_event_has_a_key_or_a_stated_reason_and_no_two_share_one(author):
    rows = key_rows(author)
    events = {row["event"] for row in rows}
    reasons = (METADATA_CHANGE, *(f"{model}." for model in NO_KEY_MODELS))
    known = Registry.read(author.container.get(Database)).events
    missing = [event for event in known if event not in events and not any(reason in event for reason in reasons)]
    shared = [key for key, count in Counter(row["key"] for row in rows).items() if count > 1]
    author.expect_rows(bool(rows), not missing, not shared)


def test_s2_the_registry_of_the_real_modules_holds_their_keys(author):
    registry = Registry.read(author.container.get(Database))
    author.expect_rows(registry.key_of_event("worker_worktree.cut") == "suites.coding.workers.worker_worktree.cut", registry.key_of_event("task.create") == "core.tasks.task.created")
    author.expect_rows(registry.event_of_key("core.settings.managed-hook.changed") == "managed-hook.changed", registry.event_of_key("core.journal.booting") == "journal.booting")
    author.expect_rows(registry.key_of_event("plugin_delivery.create") == "", registry.key_of_event("task.metadata") == "")


def test_s2_a_module_that_adds_a_clashing_key_fails_at_sync(author):
    author.expect_sync_refusal(CLASHING, CLASHING_KEY)


def test_s2_a_suite_that_is_not_installed_adds_no_keys(author):
    author.expect_no_text("event keys", "samples.edit_lock", actor=author.agent)
    author.expect_text("event keys --grep core.tasks", "core.tasks.task.created", actor=author.agent)
    author.expect_sync_success(SAMPLES)
    author.expect_text("event keys --grep edit_lock", "samples.edit_lock.created", "samples.edit_lock.ended", actor=author.agent)


def test_s3_a_listener_class_and_a_model_file_that_move_folders_change_no_key(author):
    author.expect_sync_success(NOTES)
    before = author.run("event keys", actor=author.agent).output_text
    modules = json.loads(author.home.module_list.read_text())
    author.home.module_list.write_text(json.dumps([NOTES_MOVED if module == NOTES else module for module in modules]))
    code, text = author.synced()
    assert code == 0, text
    after = author.run("event keys", actor=author.agent).output_text
    assert NOTE_CREATED in before and before == after, f"the keys changed:\n{before}\n{after}"
