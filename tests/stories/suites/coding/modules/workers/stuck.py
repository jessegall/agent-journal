from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.modules.drivers.rules.repeated_stop_release_rule import STOP_REFUSAL_COUNT
from core.testing.hook_samples import HookSamples
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

MAIN_SESSION = "s-1"
PROCESS_START = "2026-10-31T09:00:00+00:00"


def test_a_worker_that_stops_before_delivering_is_refused_every_time(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    for _ in range(STOP_REFUSAL_COUNT + 2):
        story.expect_hook_refusal(session, HookSamples.stop(), "journal worker deliver, or say why with journal wait stuck")
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {worker.id}")


def test_a_worker_with_a_task_queued_and_none_started_is_refused_its_stop(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, f"{DISPATCH} 2")
    session = worker_session(story, worker)
    story.expect_success('task block 1 --reason "waits on a person"', actor=worker)
    story.expect_hook_refusal(session, HookSamples.stop(), "task:2 is not finished")


def test_a_stuck_worker_may_stop_and_its_main_agent_hears_of_it(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    story.expect_success('wait stuck "the build tool is missing"', actor=worker)
    story.expect_hook_allowed(session, HookSamples.stop())
    story.expect_success(f"agent edit {worker.id} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "task 1 is still started")
    assert "you ended with tasks left" not in story.run(f"agent-line list --agent {worker.id}").output_text


def test_a_worker_a_person_stops_loses_its_tasks_and_is_not_started_again(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"agent edit {worker.id} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.expect_success(f"agent stop {worker.id}", f"stopped agent {worker.id}", actor=user)
    assert f"delegated_to: {worker.id}" not in story.run(lines.TASK_DETAILS).output_text
    assert "you ended with tasks left" not in story.run(f"agent-line list --agent {worker.id}").output_text
    story.expect_text(f"agent-line list --agent {story.agent.id}", "task 1 is still started")


def test_a_stopped_worker_keeps_its_task_in_testing_and_loses_the_one_queued_which_its_main_agent_hears_of(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, f"{DISPATCH} 2")
    repository.changed(worker.id, "cart.py", "TOTAL = 2\n")
    story.expect_success('proof make 1 "cart.py:1, its story" --test "pytest tests/cart.py"', actor=worker)
    story.expect_success("worker next", actor=worker)
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"agent edit {worker.id} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.expect_success(f"agent stop {worker.id}", actor=user)
    story.expect_text(lines.TASK_DETAILS, "state: testing", f"delegated_to: {worker.id}")
    assert "delegated_to" not in story.run(lines.SECOND_TASK_DETAILS).output_text


def test_a_worker_that_ends_with_only_a_queued_task_has_it_named_to_the_main_agent(new_story, monkeypatch):
    monkeypatch.setattr("suites.coding.modules.workers.listeners.ended_worker_listener.RESUME_LIMIT_COUNT", 0)
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, f"{DISPATCH} 2")
    story.expect_success('task block 1 --reason "waits on a person"', actor=worker)
    story.expect_success(f"agent edit {worker.id} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"task 2 is still queued for worker {worker.id}")


def test_a_queued_task_waiting_on_an_open_task_is_not_next_in_the_queue(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    story.run('task make "Other job" --brief "Do the other job" --environment main', actor=story.agent)
    story.expect_success("task depend 2 --on 3", actor=story.agent)
    worker = dispatched_worker(story, f"{DISPATCH} 2")
    session = worker_session(story, worker)
    story.expect_success('task block 1 --reason "waits on a person"', actor=worker)
    story.expect_hook_allowed(session, HookSamples.stop())


def test_a_worker_that_keeps_ending_is_named_to_the_main_agent(new_story, monkeypatch):
    monkeypatch.setattr("suites.coding.modules.workers.listeners.ended_worker_listener.RESUME_LIMIT_COUNT", 0)
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f"agent edit {worker.id} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"task 1 is still started under worker {worker.id}: journal worker send {worker.id}")


def test_a_worker_whose_process_is_gone_is_ended_at_the_next_tick_and_told_to_carry_on(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f"agent edit {worker.id} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent show {worker.id}", "ended_at: 2026")
    story.expect_text(f"agent-line list --agent {worker.id}", "you ended with tasks left")
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {worker.id}")


def test_a_main_session_whose_recorded_process_is_gone_is_never_ended_by_the_tick(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.expect_success(f"agent edit {story.agent.id} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.expect_rows("ended_at" not in story.run(f"agent show {story.agent.id}").output_text)


def test_a_main_session_that_ends_with_a_worker_out_leaves_its_worktree_and_the_next_session_start_names_it(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    story.hook(MAIN_SESSION, HookSamples.sample("session_end"))
    story.expect_success("worker-worktree show 1", "state: cut")
    repository.expect_head(repository.worker_branch(worker.id), repository.worktree_folder(worker.id))
    story.expect_hook_allowed("s-3", HookSamples.session_start(), f"worker:{worker.id} holds task:1")


def test_two_environments_of_one_checkout_dispatch_side_by_side_on_branches_of_their_own(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    story.expect_success(f"environment make side {repository.folder} --branch {ENVIRONMENT_BRANCH}", "name: side")
    story.expect_success('task make "Fix the till" --environment side', "environment_id: 2")
    main_worker = dispatched_worker(story)
    side_worker_id = story.new_row_id("worker dispatch --model sonnet 2 --program claude")
    story.expect_success("worker-worktree show 1", f"branch: {repository.worker_branch(main_worker.id)}", f"folder: {repository.worktree_folder(main_worker.id)}")
    story.expect_success("worker-worktree show 2", f"branch: {repository.worker_branch(side_worker_id, 'side')}", f"folder: {repository.worktree_folder(side_worker_id, 'side')}")
    repository.expect_branch_tip(repository.worker_branch(main_worker.id), repository.tip(ENVIRONMENT_BRANCH))
    repository.expect_branch_tip(repository.worker_branch(side_worker_id, "side"), repository.tip(ENVIRONMENT_BRANCH))
