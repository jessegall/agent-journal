from core.modules.drivers.repeated_stop_release import STOP_REFUSAL_COUNT
from core.testing.hook_samples import HookSamples
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

MAIN_SESSION = "s-1"
PROCESS_START = "2026-10-31T09:00:00+00:00"


def test_a_worker_that_stops_before_delivering_is_refused_until_the_stop_release_and_its_task_waits_for_a_release(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    for _ in range(STOP_REFUSAL_COUNT):
        story.expect_hook_refusal(session, HookSamples.stop(), "journal worker deliver")
    story.expect_hook_allowed(session, HookSamples.stop())
    story.expect_text(f"agent show {worker.id}", "ended_at: 2026")
    story.expect_text(f"message list --agent {story.agent.id}", f"task 1 is still started under worker {worker.id}: journal worker release {worker.id}")
    story.expect_success(f'worker release {worker.id} "its program stopped"', actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: open")


def test_a_worker_whose_process_is_gone_is_ended_at_the_next_tick_and_the_main_agent_is_told(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f"agent edit {worker.id} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent show {worker.id}", "ended_at: 2026")
    story.expect_text(f"message list --agent {story.agent.id}", f"task 1 is still started under worker {worker.id}: journal worker release {worker.id}")
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {worker.id}")


def test_a_main_session_that_ends_with_a_worker_out_leaves_its_worktree_and_the_next_session_start_names_it(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    story.hook(MAIN_SESSION, HookSamples.sample("session_end"))
    story.expect_success("worktree show 1", "state: cut")
    repository.expect_head(repository.worker_branch(worker.id), repository.worktree_folder(worker.id))
    story.expect_hook_allowed("s-3", HookSamples.session_start(), f"worker {worker.id} holds task 1, Fix the cart")


def test_two_environments_of_one_checkout_dispatch_side_by_side_on_branches_of_their_own(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    story.expect_success(f"environment make side {repository.folder} --branch {ENVIRONMENT_BRANCH}", "name: side")
    story.expect_success('task make "Fix the till" --environment side', "environment_id: 2")
    main_worker = dispatched_worker(story)
    side_worker_id = story.new_row_id("worker dispatch 2")
    story.expect_success("worktree show 1", f"branch: {repository.worker_branch(main_worker.id)}", f"folder: {repository.worktree_folder(main_worker.id)}")
    story.expect_success("worktree show 2", f"branch: {repository.worker_branch(side_worker_id, 'side')}", f"folder: {repository.worktree_folder(side_worker_id, 'side')}")
    repository.expect_branch_tip(repository.worker_branch(main_worker.id), repository.tip(ENVIRONMENT_BRANCH))
    repository.expect_branch_tip(repository.worker_branch(side_worker_id, "side"), repository.tip(ENVIRONMENT_BRANCH))
