from tests.stories.suites.coding.modules.workers.connection_recovery import SILENT_SECONDS, recovery

RESUME = "journal.suites.coding.workers.resume-silent-agents"
AUTO = "journal.suites.coding.auto-mode"


def test_s24_recovery_off_sends_no_waking_line_and_starts_no_process_for_a_silent_worker(recovery):
    recovery.story.expect_success(f"setting set {RESUME} off --environment main")
    recovery.advance(SILENT_SECONDS)
    recovery.tick()
    recovery.story.expect_rows(not recovery.launches, not recovery.lines(recovery.worker.id), not recovery.terminal_lines)


def test_s24_recovery_on_by_default_wakes_a_silent_worker_with_work(recovery):
    recovery.advance(SILENT_SECONDS)
    recovery.tick()
    recovery.story.expect_rows(len(recovery.launches) == 1)


def test_s25_the_silence_setting_still_sets_the_first_wake_delay_when_recovery_is_on(recovery):
    recovery.story.expect_success("setting set journal.suites.coding.workers.silent-agent-minutes 6 --environment main")
    recovery.advance(SILENT_SECONDS)
    recovery.tick()
    recovery.story.expect_rows(not recovery.launches)
    recovery.advance(SILENT_SECONDS)
    recovery.tick()
    recovery.story.expect_rows(len(recovery.launches) == 1)


def test_s04_auto_off_still_recovers_the_silent_worker_with_assigned_work(recovery):
    recovery.story.expect_success(f"setting set {AUTO} off --environment main")
    recovery.advance(SILENT_SECONDS)
    recovery.tick()
    recovery.story.expect_rows(len(recovery.launches) == 1)
