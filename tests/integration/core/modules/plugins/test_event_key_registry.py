import json
from collections import Counter

from engine.file.file_access import FileAccess
from engine.registry.registry import Registry
from tests.stories.core.modules.plugins.support.event_modules import CLASHING, CLASHING_KEY, NOTE_CREATED, NOTES, NOTES_MOVED

EXCLUDED_MODELS = ("plugin_delivery", "plugin_output", "plugin_queue_file")
METADATA_CHANGE = ".metadata"


def key_rows(journal) -> list[dict[str, object]]:
    answer = journal.run("event keys --json")
    assert answer.code == 0, answer.text
    return json.loads(answer.text)["rows"]


def test_every_known_event_has_a_key_or_a_stated_reason_and_no_two_share_one(journal):
    rows = key_rows(journal)
    events = {row["event"] for row in rows}
    reasons = (METADATA_CHANGE, *(f"{model}." for model in EXCLUDED_MODELS))
    unkeyed = [event for event in Registry.read(journal.database).events if event not in events and not any(reason in event for reason in reasons)]
    duplicates = [key for key, count in Counter(row["key"] for row in rows).items() if count > 1]
    assert rows and not unkeyed and not duplicates, (unkeyed, duplicates)


def test_the_registry_of_the_real_modules_holds_their_keys(journal):
    registry = Registry.read(journal.database)
    assert registry.event_key("worker_worktree.cut") == "suites.coding.workers.worker_worktree.cut" and registry.event_key("task.create") == "core.tasks.task.created"
    assert registry.event_name("core.settings.managed-hook.changed") == "managed-hook.changed" and registry.event_name("core.journal.booting") == "journal.booting"
    assert registry.event_key("plugin_delivery.create") == "" and registry.event_key("task.metadata") == ""


def test_a_module_that_adds_a_clashing_key_fails_at_sync(journal):
    journal.expect_sync_refusal(CLASHING, CLASHING_KEY)


def test_a_listener_class_and_a_model_file_that_move_folders_change_no_key(journal):
    journal.expect_sync_success(NOTES)
    original_keys = journal.run("event keys").text
    modules = json.loads(FileAccess.read(journal.home.module_list))
    FileAccess.write(journal.home.module_list, json.dumps([NOTES_MOVED if module == NOTES else module for module in modules]))
    assert journal.synced().code == 0
    assert NOTE_CREATED in original_keys and journal.run("event keys").text == original_keys
