from tests.stories.suites.coding.modules.workers.support.commit_command import request_merge
from datetime import timedelta

from suites.coding.modules.workers.models.merger_line import MergerLine
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.failed_tests import TWO_POINT_BRIEF, expect_proof_states, expect_task_states
from tests.stories.suites.coding.modules.workers.group_stop import MERGER_OFF
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.held_tasks import BUILD_TASK_IDS, worker_with_tasks, proofs, prove_task, unplanned_worker_with_tasks
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, StoryWorker

FIVE_TASKS = 5
HOARDED_TASK_IDS = BUILD_TASK_IDS[:FIVE_TASKS]
IDLE_WAIT = timedelta(minutes=20)
MAIN_SESSION = "s-1"


def merge_outcome(worker: StoryWorker):
    number = agent_number(worker.story, worker.worker.id)
    worker.repository.checkout(ENVIRONMENT_BRANCH)
    worker.story.run(f"worker logs {number}", actor=worker.story.agent)
    return worker.story.run(f"worker merge --wait {number}", actor=worker.story.agent)


def test_67_a_proof_that_claims_work_is_judged_by_nobody_at_the_hand_in_and_closes_its_task_only_by_a_check_or_a_passed_test(new_story, monkeypatch):
    worker = unplanned_worker_with_tasks(new_story, monkeypatch)
    worker.story.run('proof make 1 --task 1 "cart.py:1, the total adds the tax, read by hand"', actor=worker.worker)
    expect_proof_states(worker, "shown", 1)
    prove_task(worker, 2, 1, TEST_LINE)
    worker.story.run(COMMIT, actor=worker.worker)
    worker.story.run_listeners()
    worker.end_tests(1)
    expect_task_states(worker, "testing", 1)
    expect_task_states(worker, "started", 2)
    expect_proof_states(worker, "short", 2)
    worker.story.expect_success("proof check 1", actor=worker.story.agent)
    expect_task_states(worker, "completed", 1)


def test_68_the_same_test_command_handed_in_for_two_points_runs_for_each_proof_and_each_proof_gets_its_own_result(new_story, monkeypatch):
    worker = unplanned_worker_with_tasks(new_story, monkeypatch)
    worker.story.expect_success(TWO_POINT_BRIEF, actor=worker.story.agent)
    prove_task(worker, 1, 1, TEST_LINE)
    prove_task(worker, 1, 2, TEST_LINE)
    worker.story.run(COMMIT, actor=worker.worker)
    worker.story.run_listeners()
    test_count = len(worker.started)
    worker.end_tests(1, 0)
    expect_proof_states(worker, "short", 1)
    expect_proof_states(worker, "checked", 2)
    worker.story.expect_rows(test_count == 2, detail=f"tests started: {worker.started}")


def test_69_a_worker_that_started_five_tasks_and_did_none_is_named_with_its_tasks_and_a_person_releases_it(new_story, monkeypatch):
    worker = worker_with_tasks(new_story, monkeypatch, FIVE_TASKS, build_task_count=FIVE_TASKS)
    story = worker.story
    story.run(MERGER_OFF, actor=story.user)
    worker.program_ended()
    story.advance(IDLE_WAIT)
    story.tick(MAIN_SESSION)
    stopped_lines = [line.text for line in story.story_rows(MergerLine) if "has stopped" in line.text]
    released = story.run(f'worker release {agent_number(story, worker.worker.id)} "it did none of its tasks"', actor=story.user)
    story.expect_rows(len(stopped_lines) == 1, released.code == 0, detail=f"{stopped_lines} | {released.output_text}")
    story.expect_rows(all(f"task:{task_id}" in stopped_lines[0] for task_id in HOARDED_TASK_IDS), detail=stopped_lines[0])


def test_70_a_proof_of_an_open_task_given_to_another_worker_is_refused(new_story, monkeypatch):
    worker = worker_with_tasks(new_story, monkeypatch, 1)
    story = worker.story
    receipts = story.new_row_id('task make "Receipts" --environment main', actor=story.agent)
    audit = story.new_row_id('task make "Audit" --environment main', actor=story.agent)
    worker.added_worker(f"{DISPATCH.removesuffix(' 1')} {receipts} {audit}")
    refused = prove_task(worker, audit, 1)
    story.expect_text(f"task show {audit}", "state: open", actor=story.agent)
    story.expect_rows(refused.code != 0, f"task {audit} is not yours" in refused.output_text, proofs(worker) == (), detail=refused.output_text)


def test_72_an_interim_commit_takes_the_files_of_a_task_that_is_not_proved_and_the_merge_waits_for_the_final_commit(new_story, monkeypatch):
    worker = unplanned_worker_with_tasks(new_story, monkeypatch)
    story = worker.story
    worker.repository.changed(worker.worker.id, "task_2.txt", "half built\n")
    prove_task(worker, 1, 1)
    interim = story.run(COMMIT, actor=worker.worker)
    story.run("proof check 1", actor=story.agent)
    refused_merge = merge_outcome(worker)
    prove_task(worker, 2, 1)
    story.run(COMMIT, actor=worker.worker)
    story.run("proof check 2", actor=story.agent)
    request_merge(story, worker.worker)
    merged = merge_outcome(worker)
    story.expect_rows(interim.code == 0, "go on with task 2" in interim.output_text, refused_merge.code != 0, merged.code == 0,
                      detail=f"{interim.output_text} | {refused_merge.output_text} | {merged.output_text}")
    worker.repository.expect_file(ENVIRONMENT_BRANCH, "task_2.txt", "point 1\n")
