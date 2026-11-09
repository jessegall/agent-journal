import pytest

from core.testing.expect_reply import expect_reply_allowed, expect_reply_line, expect_reply_refusal
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, dispatched_story_worker, start_planned_worker, unplanned_worker

MODULE = "journal.suites.coding.workers"
BATCH = f"{MODULE}.test-batch-size"
PHASE = f"{MODULE}.test-at-phase-end"


def configure(worker, key, value):
    with server_story(worker.story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        return server.viewer_line_value(cookie, {"window": "settings.settings", "environment": "main", "line": ["setting", "set", key, value, "--environment", "main"]})


@pytest.fixture
def batch(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    UserJoined().steps(story)
    repository_environment(story)
    for title in ("Tax", "Totals", "Shipping", "Release"):
        story.expect_success(f'task make "{title}" --brief "Check {title}"', actor=story.agent)
    worker = dispatched_story_worker(story, "worker dispatch --model sonnet 1 2 3 4 5", monkeypatch)
    worker.save_test_alias()
    configure(worker, BATCH, "4")
    return worker


@pytest.fixture
def fourth(batch):
    for _ in range(3):
        batch.prove_advance(TEST_LINE)
    batch.story.expect_rows(batch.current_task() == 4, len(batch.started) == 0)
    return batch


@pytest.fixture
def submitted(fourth):
    fourth.prove_advance(TEST_LINE)
    return fourth


def test_a_batch_waits_for_the_fourth_task_then_runs_all_its_proofs(submitted):
    submitted.story.expect_rows(len(submitted.started) == 1, submitted.current_task() == 4)
    submitted.end_all_tests()
    submitted.story.expect_rows(len(submitted.started) == 4, submitted.current_task() == 5)
    for task in (1, 2, 3, 4):
        submitted.story.expect_text(f"task show {task}", "state: completed", actor=submitted.story.agent)


def test_a_batch_of_checked_proofs_moves_on_without_starting_a_test(batch):
    for _ in range(4):
        batch.edit_prove(TEST_LINE)
        task = batch.current_task()
        batch.story.expect_success(f"proof check {task}", actor=batch.story.agent)
        batch.story.expect_success("worker next --wait --differences none", actor=batch.worker)
    batch.story.expect_rows(batch.current_task() == 5, not batch.started)


def test_a_short_batch_runs_at_the_workers_last_task(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    UserJoined().steps(worker.story)
    configure(worker, BATCH, "4")
    worker.prove_advance(TEST_LINE)
    worker.story.expect_rows(worker.current_task() == 2, len(worker.started) == 0)
    worker.prove(TEST_LINE)
    worker.story.expect_text("worker deliver --wait --differences none", "tests of batch", actor=worker.worker)
    worker.story.expect_rows(len(worker.started) == 1)
    worker.end_all_tests()
    worker.story.expect_rows(len(worker.started) == 2)
    worker.story.expect_text("task show 1", "state: completed", actor=worker.story.agent)
    worker.story.expect_text("task show 2", "state: completed", actor=worker.story.agent)


def test_failures_of_the_batch_return_together_and_only_failures_run_again(submitted):
    submitted.end_tests(1, 0, 1, 0)
    lines = [line for line in submitted.worker_lines() if "your tests failed" in line]
    submitted.story.expect_rows(len(lines) == 1, str(submitted.started[0]) in lines[0], str(submitted.started[2]) in lines[0], submitted.current_task() == 1)
    for _ in range(4):
        expect_reply_allowed(submitted.run_test())
    submitted.story.expect_text("worker next --wait --differences none", "queued", actor=submitted.worker)
    submitted.story.expect_rows(len(submitted.started) == 5)
    submitted.end_test(submitted.started[4])
    submitted.story.expect_rows(len(submitted.started) == 6)
    submitted.end_test(submitted.started[5])
    submitted.story.expect_rows(submitted.current_task() == 5)


def test_the_phase_setting_off_tests_each_task_at_its_own_hand_in(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, build_test="pytest tests/phase.py")
    configure(worker, PHASE, "off")
    for _ in range(4):
        expect_reply_allowed(worker.run_test())
    worker.edit_prove(TEST_LINE)
    worker.story.expect_text("worker next --wait --differences none", "tests of task 1", actor=worker.worker)
    worker.story.expect_rows(len(worker.started) == 1, worker.current_task() == 1)
    worker.end_all_tests()
    worker.story.expect_rows(worker.current_task() == 2, all(process.line == TEST_LINE for process in worker.started_processes()))


def test_a_batch_has_three_own_runs_and_the_next_batch_starts_a_new_count(batch):
    for remaining in (2, 1, 0):
        reply = batch.run_test()
        expect_reply_allowed(reply)
        expect_reply_line(reply, f"Test runs left: {remaining}")
    for _ in range(3):
        batch.prove_advance(TEST_LINE)
    expect_reply_refusal(batch.run_test(), "--ask-main")
    batch.prove_advance(TEST_LINE)
    batch.end_all_tests()
    reply = batch.run_test()
    expect_reply_allowed(reply)
    expect_reply_line(reply, "Test runs left: 2")


def test_the_default_batch_size_keeps_testing_each_task(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.prove_advance(TEST_LINE)
    worker.story.expect_rows(len(worker.started) == 1, worker.current_task() == 1)
    worker.end_all_tests()
    worker.story.expect_rows(worker.current_task() == 2)


def test_worker_next_with_a_checked_proof_starts_the_next_task_without_a_test(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.edit_prove(TEST_LINE)
    worker.story.expect_success("proof check 1", actor=worker.story.agent)
    worker.story.expect_success("worker next --wait --differences none", actor=worker.worker)
    worker.story.expect_rows(worker.current_task() == 2, not worker.started)


def test_a_large_batch_moves_on_without_repeated_row_reads(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    UserJoined().steps(story)
    repository_environment(story)
    for number in range(2, 14):
        story.expect_success(f'task make "Job {number}" --brief "Do job {number}"', actor=story.agent)
    memory_id = story.new_row_id('memory make "Remember the cart" --task 1 --environment main', actor=story.agent)
    worker = dispatched_story_worker(story, "worker dispatch --model sonnet " + " ".join(str(number) for number in range(1, 14)), monkeypatch)
    configure(worker, BATCH, "12")
    for _ in range(11):
        worker.prove_advance()
    worker.prove()
    story.expect_success("worker next --wait --differences none", actor=worker.worker)
    reads = story.repeated_work.read_texts
    story.expect_rows(reads["SELECT * FROM tasks WHERE id = ? AND environment_id = ? LIMIT 1 OFFSET 0"] < 12,
                      reads["SELECT * FROM phase_tasks WHERE task_id = ? LIMIT 1 OFFSET 0"] < 12)
    story.expect_rows(worker.current_task() == 13)
    story.expect_success(f"memory show {memory_id}", "state: removed", actor=story.agent)


def test_both_settings_appear_in_the_viewers_workers_section_and_are_person_set(batch):
    with server_story(batch.story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        tree = server.viewer_line_value(cookie, {"window": "settings.settings", "environment": "main", "line": ["setting", "tree"]})
        settings = {row["key"]: row for row in tree["rows"]}
        batch.story.expect_rows(settings[BATCH]["module"] == MODULE, settings[PHASE]["module"] == MODULE,
                                settings[BATCH]["default"] == 1, settings[PHASE]["default"] is True,
                                len(settings[BATCH]["description"]) <= 120, len(settings[PHASE]["description"]) <= 120)
    for key, value in ((BATCH, "2"), (PHASE, "off")):
        batch.story.expect_refusal(f"setting set {key} {value} --environment main", "person", actor=batch.worker)


@pytest.fixture
def second(batch):
    batch.prove_advance(TEST_LINE)
    return batch


def test_a_task_handed_in_without_a_change_of_its_own_is_refused(second):
    task = second.current_task()
    second.story.expect_success(f'proof make 1 --task {task} "cart.py:1, nothing new"', actor=second.worker)
    second.story.expect_refusal("worker next --wait --differences none", f"task {task} changed no file, so it is not built", actor=second.worker)


def test_a_task_already_built_is_handed_in_by_saying_so_and_the_main_agent_reads_it(second):
    task = second.current_task()
    second.story.expect_success(f'proof make 1 --task {task} "cart.py:1, already there"', actor=second.worker)
    second.story.expect_success('worker next --wait --differences "already built on the branch"', actor=second.worker)
    second.story.expect_text(f"task-log list --task {task}", "already built on the branch", actor=second.story.agent)


def test_a_worker_revises_the_proof_of_an_earlier_task_of_its_batch(second):
    second.story.expect_success(f'proof make 1 --task 1 "cart.py:1, revised" --test "{TEST_LINE}"', actor=second.worker)
    second.story.expect_text("proof list --task 1", "revised", actor=second.story.agent)


def test_blocked_tasks_left_do_not_hold_the_delivery_of_the_handed_in_one(second):
    for task in range(second.current_task(), 6):
        second.story.expect_success(f'task block {task} --reason "the main agent runs it"', actor=second.story.agent)
    second.story.expect_success("worker deliver --wait --differences none", actor=second.worker)
