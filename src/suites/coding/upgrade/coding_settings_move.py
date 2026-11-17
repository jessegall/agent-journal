from core.modules.settings.upgrade.settings_move import FEATURE_FLAG_REASON, SettingsMove

RENAMED = {
    "workers.most_out": "journal.suites.coding.workers.worker-run-limit",
    "workers.builder_may_dispatch": "journal.suites.coding.workers.main-dispatches-workers",
}
TEST_COMMAND_REASON = "test commands now belong to each proof; supply the project command with journal proof make --test"
DROPPED_REASONS = {
    "features.checks": FEATURE_FLAG_REASON,
    "plans.test_commands": TEST_COMMAND_REASON,
    "workers.test_command": TEST_COMMAND_REASON,
    "workers.test_command_proof": "this test argument must be combined with the project test command in journal proof make --test",
    "workers.builder_may_queue": "version 5 has no separate builder queue permission; workers receive task queues through dispatch and send",
    "workers.mode": "the mode was chosen per user; version 5 chooses a driver for each environment with journal driver choose",
    "workers.command_kinds": "a worker runs every shell command in version 5",
}


class CodingSettingsMove(SettingsMove):
    """Carries coding settings and reports which old coding settings have no replacement."""

    name = "coding-settings"
    reads = ()
    references = ["settings"]
    setting_keys = (*RENAMED, *DROPPED_REASONS)
    key_replacements = RENAMED
    unsupported_keys = DROPPED_REASONS
