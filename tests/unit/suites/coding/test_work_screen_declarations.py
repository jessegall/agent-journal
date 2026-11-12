import pytest
from collections import Counter

from core.modules.helpers.support.helper_settings import HELPER_SETTING_VALUES
from suites.coding.modules.workers.support.worker_settings import WORKER_SETTING_VALUES
from suites.coding.support.coding_settings import CODING_SETTING_VALUES

DECLARED = [*CODING_SETTING_VALUES, *WORKER_SETTING_VALUES, *HELPER_SETTING_VALUES]

WORK = {
    "Taking on work": ["auto-mode", "main-writes-code"],
    "Workers": ["main-dispatches-workers", "continue-while-delegatable", "merger-on", "main-agent-may-merge"],
    "Other helpers": ["main-starts-read-only-helpers", "designer-enabled"],
    "Keeping worktrees up to date": ["keep-worktrees-up-to-date", "behind-commits-to-check", "behind-check-minutes", "behind-recheck-commits", "update-to-main-commits", "update-wait-minutes", "update-reminders", "check-history-days"],
    "Approvals": ["accept-every-approval", "skips-need-approval"],
}
TESTS = {
    "Test commands": ["affected-tests-command", "project-test-command"],
    "A worker's own runs": ["worker-run-most-tests", "worker-phase-test-runs", "worker-run-wait-seconds"],
    "Telling the main agent": ["own-test-failures-to-flag", "hand-in-failures-to-flag", "most-phase-test-deferrals"],
}


def placed(screen: str) -> dict[str, list[str]]:
    found: dict[str, list[str]] = {}
    for value in DECLARED:
        if value.screen == screen:
            found.setdefault(value.section, []).append(value.key)
    return found


def test_every_work_setting_of_the_design_is_on_the_work_screen_in_its_section():
    assert {section: sorted(keys) for section, keys in placed("work").items()} == {section: sorted(keys) for section, keys in WORK.items()}


def test_every_tests_setting_of_the_design_is_on_the_tests_screen_in_its_section():
    assert {section: sorted(keys) for section, keys in placed("tests").items()} == {section: sorted(keys) for section, keys in TESTS.items()}


def test_no_setting_is_on_two_screens_and_none_is_declared_twice():
    counts = Counter(value.key for value in DECLARED if value.screen)
    assert [key for key, count in counts.items() if count > 1] == []


def test_the_nested_work_settings_still_depend_on_their_parent_switch():
    by_key = {value.key: value for value in DECLARED}
    assert all(by_key[key].required_settings for key in ("merger-on", "main-agent-may-merge"))


ADVANCED = {
    "Context size": ["context-limit-on", "context-limit-action", "context-limit-tokens", "context-limit-kinds", "context-limit-finish-task", "context-limit-hard-tokens", "context-limit-growth-percent"],
    "Prompt cache": ["cold-session-minutes", "cold-session-context-percent"],
    "Silent agents": ["resume-silent-agents", "silent-agent-minutes", "silent-recovery-attempts", "unstarted-worker-seconds", "stopped-worker-run-minutes", "worker-resume-limit"],
    "Quiet helpers": ["quiet-helper-grace-minutes", "quiet-helper-minutes", "idle-worker-repeat-minutes"],
}


def test_every_advanced_setting_of_the_design_is_on_the_advanced_screen_in_its_section():
    assert {section: sorted(keys) for section, keys in placed("advanced").items()} == {section: sorted(keys) for section, keys in ADVANCED.items()}


def test_the_context_size_per_kind_is_a_keyed_cap_table_on_advanced_and_per_helper_type_is_on_the_helper_types_screen():
    by_key = {value.key: value for value in DECLARED}
    kinds, profiles = by_key["context-limit-kinds"], by_key["context-limit-profiles"]
    assert (kinds.component.value, kinds.screen, profiles.component.value, profiles.screen) == ("keyed-cap-table", "advanced", "three-way-cap", "helper-type")


def test_the_settings_of_a_helper_type_screen_are_not_on_advanced():
    on_advanced = {value.key for value in DECLARED if value.screen == "advanced"}
    assert on_advanced.isdisjoint({"worker-run-limit", "worker-kept-limit", "worker-idle-hours", "worker-batch-size", "most-open-tasks"})


def test_the_workers_screen_holds_its_settings_and_no_merger_setting():
    screens = {value.key: value.screen for value in DECLARED}
    workers = sorted(key for key, screen in screens.items() if screen == "helper-type.workers")
    assert workers == sorted(["worker-run-limit", "worker-kept-limit", "worker-batch-size", "most-open-tasks", "workers-start-read-only-helpers", "idle-worker-minutes", "worker-idle-hours"])
    assert "merger-wait-minutes" not in workers


def test_the_merger_screen_holds_the_waits_questions_and_commands_of_the_merger():
    merger = sorted(value.key for value in DECLARED if value.screen == "helper-type.merger")
    assert merger == sorted(["merger-wait-minutes", "ask-answer-minutes", "ask-pass-on-minutes", "ask-visits-limit", "most-merger-messages-per-group", "merger-commands"])
