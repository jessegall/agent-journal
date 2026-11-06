from core.base.actor import Actor
from core.base.actor_type import ActorType
from datetime import timedelta

from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.testing.hook_samples import HookSamples
from suites.coding.modules.workers.support.worker_resume import WorkerResume
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import worker_session
import subprocess

from core.base.journal_home import LAUNCHER_SOCKET
from core.testing.fake_launcher import FakeLauncher
from datetime import timedelta

from tests.stories.core.modules.chat.support.mark_samples import expect_marks_text
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, checked_worker, delivered_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.web_build import BUILT_TEXT, build_repository
from tests.stories.support.story_checks import expect_requests_launcher

MAIN_SESSION = "s-1"
BUILT_FILE = "app/web/dist/chat.js"


def test_a_checked_worktree_merges_into_the_base_branch_in_the_environments_folder(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: completed")
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", CART_CHANGE)
    repository.expect_merge_commit(ENVIRONMENT_BRANCH)
    repository.expect_head(ENVIRONMENT_BRANCH)


def test_a_merged_worker_whose_program_never_ended_ends_at_the_merge_and_is_not_named_as_inactive(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_rows(story.container.get(Queries).query(Agent).find(worker.id).ended_at is None)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    story.expect_rows(story.container.get(Queries).query(Agent).find(worker.id).ended_at is not None)
    story.advance(timedelta(minutes=10))
    story.tick("s-1")
    story.run_listeners()
    story.expect_absent(f"agent-line list --agent {story.agent.id}", f"worker:{worker.id} has used no tool")


def test_a_worktree_with_a_proof_not_checked_is_refused_its_merge_naming_the_point(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    base_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_refusal(f"worker merge {worker.id}", "point 1 is not checked", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: testing")
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, base_tip)


def test_a_base_branch_that_moved_without_a_clash_is_merged_in_and_merged(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("tax.py", "TAX = 21\n", "The tax")
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: completed")
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", CART_CHANGE)
    repository.expect_file(ENVIRONMENT_BRANCH, "tax.py", "TAX = 21\n")


def test_a_base_branch_that_moved_with_a_clash_sends_the_task_back_to_the_worker_with_the_files_and_conflict_markers(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    worker_tip = repository.tip(repository.worker_branch(worker.id))
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("cart.py", "TOTAL = 2\n", "Another total")
    base_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_text(f"worker merge {worker.id}", "clashed on cart.py", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {worker.id}")
    story.expect_success("worker-worktree show 1", "state: cut")
    story.expect_text(f"agent-line list --agent {worker.id}", f"{ENVIRONMENT_BRANCH} is merged into your worktree and clashes on cart.py: settle the markers there, then journal worker deliver")
    expect_worktree_folder_repository_with(repository, worker, "cart.py", "<<<<<<<")
    repository.expect_branch_tip(repository.worker_branch(worker.id), worker_tip)
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, base_tip)


def test_a_moved_base_is_rebased_under_the_uncommitted_changes_of_the_worker_and_they_are_put_back(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.changed(worker.id, "extra.py", "EXTRA = 1\n")
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("tax.py", "TAX = 21\n", "The tax")
    tax_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: completed")
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", CART_CHANGE)
    repository.expect_file(ENVIRONMENT_BRANCH, "tax.py", "TAX = 21\n")
    repository.expect_file(ENVIRONMENT_BRANCH, "extra.py", "EXTRA = 1\n")
    repository.expect_merge_commits_after(ENVIRONMENT_BRANCH, tax_tip, 1)
    repository.expect_no_stash()


def test_a_clash_of_committed_work_with_a_moved_base_leaves_the_uncommitted_changes_in_the_worktree_and_no_stash(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.changed(worker.id, "extra.py", "EXTRA = 1\n")
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("cart.py", "TOTAL = 2\n", "Another total")
    story.expect_text(f"worker merge {worker.id}", "clashed on cart.py", actor=story.agent)
    expect_worktree_folder_repository_with(repository, worker, "cart.py", "<<<<<<<")
    expect_worktree_folder_repository_2(repository, worker, "extra.py", "EXTRA = 1\n")
    repository.expect_no_stash()


def test_uncommitted_changes_that_clash_with_a_moved_base_go_back_to_the_worker_with_conflict_markers(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("tax.py", "TAX = 1\n", "The first tax")
    worker = checked_worker(story, repository)
    repository.changed(worker.id, "tax.py", "TAX = 5\n")
    repository.committed("tax.py", "TAX = 2\n", "Another tax")
    base_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_text(f"worker merge {worker.id}", "clashed on tax.py", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {worker.id}")
    expect_worktree_folder_repository_with(repository, worker, "tax.py", "<<<<<<<")
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, base_tip)
    repository.expect_no_stash()


def test_uncommitted_changes_whose_stash_cannot_apply_stay_in_the_stash_and_refuse_the_merge(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    repository.checkout(ENVIRONMENT_BRANCH)
    worker = checked_worker(story, repository)
    (repository.worktree_folder(worker.id) / "extra.py").write_text("EXTRA = 1\n")
    repository.committed("extra.py", "EXTRA = 2\n", "Another extra")
    base_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_refusal(f"worker merge {worker.id}", "git stash apply failed", actor=story.agent)
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, base_tip)
    expect_stdout_subprocess("git", "stash", "list", repository, worker)


def test_delivering_with_conflict_markers_left_is_refused_and_puts_none_on_the_base_branch(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("cart.py", "TOTAL = 2\n", "Another total")
    base_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_text(f"worker merge {worker.id}", "clashed on cart.py", actor=story.agent)
    story.expect_refusal("worker deliver --differences none", "conflict markers remain in cart.py", actor=worker)
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, base_tip)


def test_a_clash_only_on_built_files_merges_with_a_fresh_build(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = build_repository(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    repository.changed(worker.id, BUILT_FILE, "built by the worker\n")
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart total story"', actor=worker)
    story.expect_success("worker deliver --differences none", actor=worker)
    story.expect_success("proof check 1", actor=story.agent)
    repository.committed(BUILT_FILE, "built on the branch\n", "Another build")
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: completed")
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", CART_CHANGE)
    repository.expect_file(ENVIRONMENT_BRANCH, BUILT_FILE, BUILT_TEXT)


def test_a_worker_settles_a_clash_and_its_next_merge_goes_through(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("cart.py", "TOTAL = 2\n", "Another total")
    story.expect_text(f"worker merge {worker.id}", "clashed on cart.py", actor=story.agent)
    (repository.worktree_folder(worker.id) / "cart.py").write_text("TOTAL = 3\n")
    story.expect_success("worker deliver --differences none", actor=worker)
    story.expect_success("worker-worktree show 1", "state: delivered")
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", "TOTAL = 3\n")


def test_a_job_for_a_worker_comes_on_the_latest_of_its_base_branch(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("tax.py", "TAX = 21\n", "The tax")
    story.expect_success(f'worker send {worker.id} "one more thing"', actor=story.agent)
    expect_worktree_folder_repository_2(repository, worker, "tax.py", "TAX = 21\n")


def test_a_job_sent_to_a_worker_shows_as_a_mark_naming_the_worker(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f'worker send {worker.id} "one more thing"', actor=story.agent)
    story.run_listeners()
    expect_marks_text(story, f"Worker {worker.id} was sent its next job")


def test_a_merge_while_the_checkout_is_on_another_branch_moves_nothing_reminds_each_hour_and_goes_through_once_it_is_back(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    base_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_refusal(f"worker merge {worker.id}", "the checkout of environment main is on main, not on version-5; the merge waits until it is back", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: testing")
    story.expect_success("worker-worktree show 1", "state: delivered")
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, base_tip)
    reminder = f"the merge of worker {worker.id} waits for the checkout of environment main to return to version-5"
    main_lines = f"agent-line list --agent {story.agent.id}"
    story.tick(MAIN_SESSION)
    story.tick(MAIN_SESSION)
    story.expect_rows(story.run(main_lines).output_text.count(reminder) == 1)
    story.advance(timedelta(hours=1))
    story.tick(MAIN_SESSION)
    story.expect_rows(story.run(main_lines).output_text.count(reminder) == 2)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: completed")
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", CART_CHANGE)


def test_a_merge_after_the_environments_branch_changed_is_refused(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success("environment edit 1 --branch version-6", "branch: version-6")
    story.expect_refusal(f"worker merge {worker.id}",
                         f"environment main now builds on version-6; worker worker-{worker.id} was cut from version-5: release it and dispatch the task again", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: testing")


def test_a_merge_over_uncommitted_changes_in_the_checkout_to_files_the_worker_changed_is_refused_naming_them_before_any_merge(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    worker_tip = repository.tip(repository.worker_branch(worker.id))
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("tax.py", "TAX = 21\n", "The tax")
    repository.uncommitted("cart.py", "TOTAL = 5\n")
    base_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_refusal(f"worker merge {worker.id}", "the checkout of environment main has uncommitted changes to cart.py", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: testing")
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, base_tip)
    repository.expect_branch_tip(repository.worker_branch(worker.id), worker_tip)


def test_a_clash_resumes_a_worker_that_has_ended_with_the_clash_as_its_job(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("cart.py", "TOTAL = 2\n", "Another total")
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET))
    story.expect_text(f"worker merge {worker.id}", "clashed on cart.py", actor=story.agent)
    story.run_listeners()
    launcher.expect_started(worker.id, worker_session(story, worker), repository.worktree_folder(worker.id))
    expect_command_requests_launcher_with(launcher, 1, "--resume")
    expect_command_requests_launcher_line_2(launcher, 1, "clashes on cart.py")
    story.expect_text(f"agent-line list --agent {worker.id}", "entered")


def test_a_job_the_launcher_could_not_start_stays_waiting(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET), answer=b"failed\n")
    story.run(f'worker send {worker.id} "Add the tax as well"', actor=story.agent)
    story.run_listeners()
    launcher.thread.join(10)
    story.expect_rows(len(launcher.requests) == 1)
    story.expect_text(f"agent-line list --agent {worker.id}", "waiting")


def test_a_job_for_a_worker_whose_program_still_runs_waits_for_its_next_hook(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET), answer=b"running\n")
    story.run(f'worker send {worker.id} "Add the tax as well"', actor=story.agent)
    story.run_listeners()
    launcher.thread.join(10)
    story.expect_rows(len(launcher.requests) == 1)
    story.expect_text(f"agent-line list --agent {worker.id} --state waiting", "Add the tax as well")


def test_a_resume_that_never_came_back_is_started_again_by_the_next_job_after_two_minutes(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.advance(timedelta(seconds=5))
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET), answer=b"started\n", request_count=2)
    story.run(f'worker send {worker.id} "Add the tax as well"', actor=story.agent)
    story.run_listeners()
    story.run(f'worker send {worker.id} "And the receipt"', actor=story.agent)
    story.run_listeners()
    story.expect_rows(len(launcher.requests) == 1)
    story.advance(timedelta(minutes=3))
    story.run(f'worker send {worker.id} "And the total"', actor=story.agent)
    story.run_listeners()
    launcher.thread.join(10)
    story.expect_rows(len(launcher.requests) == 2)
    expect_command_requests_launcher_line(launcher, "And the receipt")


def test_a_delivered_worker_sent_a_job_has_its_task_back_in_hand_and_a_running_one_reads_it_at_its_next_hook(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_text(f'worker send {worker.id} "Add the tax as well"', f"worker {worker.id} takes the job", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {worker.id}")
    story.expect_success("worker-worktree show 1", "state: cut")
    story.expect_text(f"agent-line list --agent {worker.id}", "Add the tax as well", "waiting")


def test_an_ended_worker_sent_a_job_resumes_its_session_with_the_job(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET))
    story.run(f'worker send {worker.id} "Add the tax as well"', actor=story.agent)
    story.run_listeners()
    launcher.expect_started(worker.id, worker_session(story, worker), repository.worktree_folder(worker.id))
    expect_command_requests_launcher_with(launcher, 1, "--resume")


def test_a_worker_with_no_worktree_is_not_sent_a_job(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    story.expect_refusal(f'worker send {worker.id} "Add the tax"', f"worker {worker.id} has no worktree", actor=story.agent)


def ended_worker(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    return story, repository, worker


def test_a_resumed_worker_comes_back_as_a_worker_with_its_number(new_story):
    story, _, worker = ended_worker(new_story)
    session = worker_session(story, worker)
    story.hook(session, HookSamples.session_start())
    story.expect_success(f"agent show {worker.id}", "role: worker")
    story.expect_no_text(f"agent show {worker.id}", "ended_at:")


def test_with_no_launcher_a_job_stays_waiting_and_the_sender_is_told(new_story):
    story, _, worker = ended_worker(new_story)
    story.expect_text(f'worker send {worker.id} "Add the tax"', "needs the launcher", actor=story.agent)
    story.run_listeners()
    story.expect_text(f"agent-line list --agent {worker.id}", "Add the tax", "waiting")


def test_two_jobs_close_together_start_the_worker_once(new_story):
    story, repository, worker = ended_worker(new_story)
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET))
    story.run(f'worker send {worker.id} "First job"', actor=story.agent)
    story.run_listeners()
    launcher.expect_started(worker.id, worker_session(story, worker), repository.worktree_folder(worker.id))
    story.advance(timedelta(seconds=1))
    story.run(f'worker send {worker.id} "Second job"', actor=story.agent)
    story.run_listeners()
    expect_requests_launcher(launcher, 1)
    story.expect_text(f"agent-line list --agent {worker.id}", "Second job", "waiting")


def test_a_worker_the_main_agent_stops_stays_stopped_with_its_job_waiting(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.run(f'worker send {worker.id} "Add the tax as well"', actor=story.agent)
    story.run_listeners()
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET), answer=b"stopped\n", request_count=2)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.run_listeners()
    WorkerResumeRetry()(story.container)
    story.expect_rows(launcher.requests == [{"agent_id": worker.id, "stop": True}])
    story.expect_text(f"agent-line list --agent {worker.id}", "Add the tax as well", "waiting")
    launcher.server.close()


def test_a_worker_a_person_stops_stays_stopped_with_its_job_waiting(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.run(f'worker send {worker.id} "Add the tax as well"', actor=story.agent)
    story.run_listeners()
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET), answer=b"stopped\n", request_count=2)
    story.expect_success(f"agent end {worker.id}", actor=user)
    story.run_listeners()
    WorkerResumeRetry()(story.container)
    story.expect_rows(launcher.requests == [{"agent_id": worker.id, "stop": True}])
    story.expect_text(f"agent-line list --agent {worker.id}", "Add the tax as well", "waiting")
    launcher.server.close()


def test_a_job_refused_because_the_program_still_runs_starts_the_worker_when_the_program_has_ended(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.advance(timedelta(seconds=5))
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET), answers=(b"running\n", b"started\n"), request_count=2)
    story.run(f'worker send {worker.id} "Add the tax as well"', actor=story.agent)
    story.run_listeners()
    story.expect_text(f"agent-line list --agent {worker.id}", "Add the tax as well", "waiting")
    WorkerResumeRetry()(story.container)
    launcher.thread.join(10)
    story.expect_rows(len(launcher.requests) == 2)
    expect_command_requests_launcher_line(launcher, "Add the tax as well")
    story.expect_text(f"agent-line list --agent {worker.id}", "Add the tax as well", "entered")
    WorkerResumeRetry()(story.container)
    story.expect_rows(len(launcher.requests) == 2)


def test_a_job_whose_program_died_at_once_is_handed_again_by_the_next_trigger(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.advance(timedelta(seconds=5))
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET), answer=b"started\n", request_count=2)
    story.run(f'worker send {worker.id} "Add the tax as well"', actor=story.agent)
    story.run_listeners()
    story.expect_rows(len(launcher.requests) == 1)
    story.advance(timedelta(minutes=3))
    story.container.get(WorkerResume).resume(story.container.get(Queries).query(Agent).find(worker.id), story.agent)
    launcher.thread.join(10)
    story.expect_rows(len(launcher.requests) == 2)
    expect_command_requests_launcher_line(launcher, "Add the tax as well")


def expect_command_requests_launcher_line(launcher, expected) -> None:
    actual = launcher.requests[1]['command']
    assert any(expected in line for line in actual), actual


def expect_command_requests_launcher_with(launcher, number, expected) -> None:
    actual = launcher.requests[-number]['command']
    assert expected in actual, actual


def expect_command_requests_launcher_line_2(launcher, number, expected) -> None:
    actual = launcher.requests[-number]['command']
    assert any(expected in line for line in actual), actual


def expect_worktree_folder_repository_2(repository, worker, text, expected) -> None:
    actual = (repository.worktree_folder(worker.id) / text).read_text()
    assert actual == expected, actual


def expect_stdout_subprocess(text, text_2, text_3, repository, worker) -> None:
    actual = subprocess.run([text, text_2, text_3], cwd=repository.worktree_folder(worker.id), capture_output=True, text=True).stdout.strip()
    assert actual, actual


def expect_worktree_folder_repository_with(repository, worker, text, expected) -> None:
    actual = (repository.worktree_folder(worker.id) / text).read_text()
    assert expected in actual, actual
