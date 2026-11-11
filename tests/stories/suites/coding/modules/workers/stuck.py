from tests.stories.core.support.agent_labels import agent_number
import pytest

from suites.coding.modules.workers.support.worker_launch_failures import WorkerLaunchFailures
import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.query.queries import Queries
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.models.merger_line import MergerLine
from core.modules.drivers.rules.repeated_stop_release_rule import STOP_REFUSAL_COUNT
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.processes.support.process_samples import start_process
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.report import MergerOffOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.merger_launcher import merger_can_start, running_launcher
from tests.stories.core.support.agent_labels import agent_label
from tests.stories.suites.coding.modules.workers.support.work_setting_stories import set_resume_limit
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome

MAIN_SESSION = "s-1"
PROCESS_START = "2026-10-31T09:00:00+00:00"



@pytest.fixture(autouse=True)
def long_running_workers(monkeypatch):
    monkeypatch.setattr(WorkerLaunchFailures, "has_failed", lambda failures, worker: False)


def last_reply(tmp_path, session, text):
    transcript = tmp_path / "claude" / "projects" / "worker" / f"{session}.jsonl"
    transcript.parent.mkdir(parents=True)
    rows = [{"type": "assistant", "message": {"content": [{"type": "text", "text": text}]}}, {"type": "user", "message": {"content": "carry on"}}]
    transcript.write_text("\n".join(json.dumps(row) for row in rows) + "\n")


def stop_mark(story, variant):
    listed = story.run("chat-mark list --environment 1").output_text
    return next(line.split()[0] for line in listed.splitlines() if variant in line)


def test_a_worker_with_a_task_queued_and_none_started_is_refused_its_stop(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, f"{DISPATCH} 2")
    session = worker_session(story, worker)
    story.expect_success('task block 1 --reason "waits on a person"', actor=worker)
    story.expect_hook_refusal(session, HookSamples.stop(), "Task 2 is not finished")


def test_a_worker_that_says_stuck_while_its_run_goes_tells_its_main_agent_nothing_when_it_stops(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    main = story.agent
    worker = dispatched_worker(story)
    story.expect_success("setting set journal.core.processes.readers-forced off --environment main")
    story.expect_success("setting set journal.suites.coding.workers.worker-run-most-tests 0 --environment main")
    story.agent = worker
    start_process(story, "make check", category=CommandCategory.TEST_RUN)
    story.agent = main
    story.expect_success('wait stuck "waiting for my test"', actor=worker)
    story.expect_success(f"agent edit {agent_number(story, worker.id)} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.expect_no_text(f"agent-line list --agent {main.id}", "is stuck")
    story.expect_no_text(f"agent-line list --agent {main.id}", "ended with")


def test_a_stuck_worker_may_stop_and_its_main_agent_hears_of_it(new_story):
    story = new_story(fixture=MergerOffOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    story.expect_success('wait stuck "the build tool is missing"', actor=worker)
    story.expect_hook_allowed(session, HookSamples.stop())
    story.expect_success(f"agent edit {agent_number(story, worker.id)} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "ended with task:1 left")
    story.expect_no_text(f"agent-line list --agent {worker.id}", "you ended with tasks left")


def test_a_stuck_worker_tells_its_main_agent_at_once_and_shows_a_mark_in_the_main_chat(new_story, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    story = new_story(fixture=MergerOffOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    last_reply(tmp_path, worker_session(story, worker), "The build tool is gone from the path")
    story.expect_success('wait stuck "the build tool is missing"', actor=worker)
    story.run_listeners()
    story.expect_text(f"agent-line list --agent {story.agent.id}", "merger-line:1", "workers.help-request")
    help_request = story.container.get(Queries).query(MergerLine).first()
    story.expect_rows(help_request.worker_id == worker.id, "is stuck on task:1" in help_request.text, help_request.outcome is AskOutcome.FORWARDED, detail=str(help_request))
    story.expect_text("chat-mark list --environment 1", f"Worker {worker.id} is stuck: the build tool is missing")
    story.expect_text(f"chat-mark show {stop_mark(story, 'help request')}", "Tasks left: task 1", "Task 1: ", "Last words: The build tool is gone from the path", f"target_id: {worker.id}", "outcome: warned")
    story.expect_absent(f"chat-mark show {stop_mark(story, 'help request')}", "agent_id:")


def test_a_worker_that_stops_with_tasks_left_shows_a_mark_and_its_main_agent_hears_it_is_started_again(new_story, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    story = new_story(fixture=MergerOffOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    last_reply(tmp_path, worker_session(story, worker), "I ran out of ideas")
    story.expect_success(f"agent edit {agent_number(story, worker.id)} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.run_listeners()
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{agent_number(story, worker.id)} stopped with task:1 left and is started again")
    story.expect_text("chat-mark list --environment 1", f"Worker {worker.id} stopped with 1 tasks left")
    story.expect_text(f"chat-mark show {stop_mark(story, 'ended early')}", "Tasks left: task 1", "Last words: I ran out of ideas")


def test_a_worker_with_no_tasks_left_shows_no_stop_mark(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success("task cancel 1 --reason gone", actor=story.agent)
    story.expect_success(f"agent edit {agent_number(story, worker.id)} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.run_listeners()
    story.expect_absent("chat-mark list --environment 1", "stopped with")


def test_a_worker_a_person_stops_loses_its_tasks_and_is_not_started_again(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"agent edit {agent_number(story, worker.id)} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.expect_success(f"agent stop {agent_number(story, worker.id)}", f"stopped {agent_label(story, worker.id)}", actor=user)
    story.expect_no_text(lines.TASK_DETAILS, f"delegated_to: {worker.id}")
    story.expect_no_text(f"agent-line list --agent {worker.id}", "you ended with tasks left")
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "ended with task:1 left")


def test_a_stopped_worker_keeps_its_task_in_testing_and_loses_the_one_queued_which_its_main_agent_hears_of(new_story):
    story = new_story(fixture=MergerOffOrchestrator)
    repository = repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, f"{DISPATCH} 2")
    repository.changed(worker.id, "cart.py", "TOTAL = 2\n")
    story.expect_success('proof make 1 --task 1 "cart.py:1, its story" --test "python tests/cart.py"', actor=worker)
    story.expect_success("worker next --wait --differences none", actor=worker)
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"agent edit {agent_number(story, worker.id)} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.expect_success(f"agent stop {agent_number(story, worker.id)}", actor=user)
    story.expect_text(lines.TASK_DETAILS, "state: testing", f"delegated_to: {worker.id}")
    story.expect_no_text(lines.SECOND_TASK_DETAILS, "delegated_to")


def test_a_worker_that_ends_with_only_a_queued_task_has_it_named_to_the_main_agent(new_story):
    story = new_story(fixture=MergerOffOrchestrator)
    repository_environment(story)
    set_resume_limit(story, 0)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, f"{DISPATCH} 2")
    story.expect_success('task block 1 --reason "waits on a person"', actor=worker)
    story.expect_success(f"agent edit {agent_number(story, worker.id)} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{agent_number(story, worker.id)} ended with task:2 left")


def test_a_queued_task_waiting_on_an_open_task_is_not_next_in_the_queue(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    story.run('task make "Other job" --brief "Do the other job" --environment main', actor=story.agent)
    story.expect_success("task depend 2 --on 3", actor=story.agent)
    worker = dispatched_worker(story, f"{DISPATCH} 2")
    session = worker_session(story, worker)
    story.expect_success('task block 1 --reason "waits on a person"', actor=worker)
    story.expect_hook_allowed(session, HookSamples.stop())


def test_a_worker_that_keeps_ending_is_named_to_the_main_agent(new_story):
    story = new_story(fixture=MergerOffOrchestrator)
    repository_environment(story)
    set_resume_limit(story, 0)
    worker = dispatched_worker(story)
    story.expect_success(f"agent edit {agent_number(story, worker.id)} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{agent_number(story, worker.id)} ended with task:1 left: send it a job, or release it")


def test_a_worker_that_ends_with_many_tasks_left_gives_the_main_agent_one_line(new_story):
    story = new_story(fixture=MergerOffOrchestrator)
    repository_environment(story)
    set_resume_limit(story, 0)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    story.run('task make "Third job" --brief "Do the third job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, f"{DISPATCH} 2 3")
    story.expect_success(f"agent edit {agent_number(story, worker.id)} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{agent_number(story, worker.id)} ended with task:1, task:2, task:3 left")
    story.expect_absent(f"agent-line list --agent {story.agent.id}", "is still queued")


def test_a_worker_whose_process_is_gone_is_ended_at_the_next_tick_and_told_to_carry_on(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f"agent edit {agent_number(story, worker.id)} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent show {agent_number(story, worker.id)}", "ended_at: 2026")
    story.expect_text(f"agent-line list --agent {worker.id}", "you ended with tasks left")
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {worker.id}")


def test_a_main_session_whose_recorded_process_is_gone_is_never_ended_by_the_tick(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.expect_success(f"agent edit {agent_number(story, story.agent.id)} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.expect_rows("ended_at" not in story.run(f"agent show {agent_number(story, story.agent.id)}").output_text)


def test_a_main_session_that_ends_with_a_worker_out_leaves_its_worktree_and_the_next_session_start_names_it(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    story.hook(MAIN_SESSION, HookSamples.sample("session_end"))
    story.expect_success("worker-worktree show 1", "state: cut")
    repository.expect_head(repository.worker_branch(worker.id), repository.worktree_folder(worker.id))
    story.expect_hook_allowed("s-3", HookSamples.session_start(), f"worker:{agent_number(story, worker.id)} has task:1")


def test_two_environments_of_one_checkout_dispatch_side_by_side_on_branches_of_their_own(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    story.expect_success(f"environment make side {repository.folder} --branch {ENVIRONMENT_BRANCH}", "name: side")
    story.expect_success('task make "Fix the till" --environment side', "environment_id: 2")
    main_worker = dispatched_worker(story)
    side_worker_id = story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 2 --program claude --environment side")
    story.expect_success("worker-worktree show 1", f"branch: {repository.worker_branch(main_worker.id)}", f"folder: {repository.worktree_folder(main_worker.id)}")
    story.expect_success("worker-worktree show 2 --environment side", f"branch: {repository.worker_branch(side_worker_id, 'side')}", f"folder: {repository.worktree_folder(side_worker_id, 'side')}")
    repository.expect_branch_tip(repository.worker_branch(main_worker.id), repository.tip(ENVIRONMENT_BRANCH))
    repository.expect_branch_tip(repository.worker_branch(side_worker_id, "side"), repository.tip(ENVIRONMENT_BRANCH))


def test_a_stuck_worker_reaches_the_merger_and_not_the_main_agent(new_story, monkeypatch):
    merger_can_start(monkeypatch)
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    with running_launcher(story):
        story.expect_success('wait stuck "the build tool is missing"', actor=worker)
        story.run_listeners()
    rows = story.container.get(Queries).query(MergerLine).all_rows()
    story.expect_rows(any(f"worker:{agent_number(story, worker.id)} is stuck on task:1" in row.text for row in rows), detail=str(rows))
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "is stuck")
