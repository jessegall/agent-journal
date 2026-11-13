from tests.stories.suites.coding.modules.workers.support.commit_command import asked_for_merge
from tests.stories.core.support.agent_labels import agent_label
from tests.stories.core.support.agent_labels import agent_number
from core.modules.agents.support.agent_conversations import AgentConversations
import pytest

from engine.actor.actor import Actor
from engine.caller.caller_request import CallerRequest
from engine.caller.process_row import ProcessRow
from engine.enums.command_category import CommandCategory
from engine.testing.examples.shell_part import ShellPart
from core.modules.processes.models.output import Output
from suites.coding.modules.workers.models.worktree import Worktree
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from engine.enums.actor_type import ActorType
from datetime import timedelta

from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from engine.testing.examples.hook_samples import HookSamples
from suites.coding.modules.workers.support.worker_resume import WorkerResume
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import worker_session
import subprocess

from engine.journal.journal_home import LAUNCHER_SOCKET
from core.modules.agents.testing.fake_launcher import FakeLauncher
from datetime import timedelta

from tests.stories.core.modules.chat.support.mark_samples import expect_marks_text
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, checked_worker, delivered_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.web_build import BUILT_TEXT, build_repository
from tests.stories.support.story_checks import expect_requests_launcher
from core.modules.processes.support.process_nudges import READ_COMMAND_OUTPUT
from engine.testing.expectations.expect_nudge import said
from suites.coding.modules.workers.support.worker_nudges import MERGE_WAITS
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED


pytestmark = pytest.mark.real_git

MAIN_SESSION = "s-1"
BUILT_FILE = "app/web/dist/chat.js"



@pytest.fixture(autouse=True)
def workers_have_conversations(monkeypatch):
    monkeypatch.setattr(AgentConversations, "exists", lambda conversations, agent: True)


def test_a_merged_worker_whose_program_never_ended_ends_at_the_merge_and_is_not_named_as_inactive(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_rows(story.container.get(Queries).query(Agent).find(worker.id).ended_at is None)
    asked_for_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_rows(story.container.get(Queries).query(Agent).find(worker.id).ended_at is not None)
    story.advance(timedelta(minutes=10))
    story.tick("s-1")
    story.run_listeners()
    story.expect_absent(f"agent-line list --agent {story.agent.id}", f"worker:{agent_number(story, worker.id)} used no tool")


@pytest.fixture
def checked_work(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    return story, repository, checked_worker(story, repository)



def test_a_worker_settles_a_clash_and_its_next_merge_goes_through(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("cart.py", "TOTAL = 2\n", "Another total")
    story.expect_text(f"worker merge --wait {agent_number(story, worker.id)}", "clashed on cart.py", actor=story.agent)
    (repository.worktree_folder(worker.id) / "cart.py").write_text("TOTAL = 3\n")
    story.expect_success("worker commit --wait --differences none", actor=worker)
    story.expect_success("worker-worktree show 1", "state: delivered")
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    asked_for_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", "TOTAL = 3\n")


def test_a_merge_while_the_checkout_is_on_another_branch_moves_nothing_reminds_each_hour_and_goes_through_once_it_is_back(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    base_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_refusal(f"worker merge --wait {agent_number(story, worker.id)}", "the checkout of environment main is on main, not on version-5; the merge waits until it is back", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: completed")
    story.expect_success("worker-worktree show 1", "state: delivered")
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, base_tip)
    reminder = MERGE_WAITS.nudge(worker=agent_number(story, worker.id), environment='main', branch='version-5').text
    main_lines = f"agent-line list --agent {story.agent.id}"
    story.tick(MAIN_SESSION)
    story.tick(MAIN_SESSION)
    story.expect_rows(story.run(main_lines).output_text.count(reminder) == 1)
    story.advance(timedelta(hours=1))
    story.tick(MAIN_SESSION)
    story.expect_rows(story.run(main_lines).output_text.count(reminder) == 2)
    repository.checkout(ENVIRONMENT_BRANCH)
    asked_for_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: completed")
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", CART_CHANGE)


def test_a_clash_resumes_a_worker_that_has_ended_with_the_clash_as_its_job(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("cart.py", "TOTAL = 2\n", "Another total")
    launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET))
    story.expect_text(f"worker merge --wait {agent_number(story, worker.id)}", "clashed on cart.py", actor=story.agent)
    story.run_listeners()
    launcher.expect_started(worker.id, worker_session(story, worker), repository.worktree_folder(worker.id))
    expect_command_requests_launcher_with(launcher, 1, "--resume")
    expect_command_requests_launcher_line_2(launcher, 1, "clashes on cart.py")
    story.expect_text(f"agent-line list --agent {worker.id}", "clashes on cart.py", "waiting")


def test_a_resume_that_never_came_back_is_started_again_by_the_next_job_after_two_minutes(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.advance(timedelta(seconds=5))
    story.use_processes(ProcessRow(701, 1, story.clock.timestamp()))
    launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET), answer=b"started 701\n", request_count=3)
    story.run(f'worker send --wait {agent_number(story, worker.id)} "Add the tax as well"', actor=story.agent)
    story.run_listeners()
    story.run(f'worker send --wait {agent_number(story, worker.id)} "And the receipt"', actor=story.agent)
    story.run_listeners()
    story.expect_rows(len(worker_starts(launcher, worker)) == 1)
    story.advance(timedelta(minutes=3))
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.run(f'worker send --wait {agent_number(story, worker.id)} "And the total"', actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    story.expect_rows(len(worker_starts(launcher, worker)) == 2)
    expect_command_requests_launcher_line(launcher, "And the receipt")


def test_a_delivered_worker_sent_a_job_has_its_task_back_in_hand_and_a_running_one_reads_it_at_its_next_hook(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_text(f'worker send --wait {agent_number(story, worker.id)} "Add the tax as well"', f"{agent_label(story, worker.id)} takes the job", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {worker.id}")
    story.expect_success("worker-worktree show 1", "state: cut")
    story.expect_text(f"agent-line list --agent {worker.id}", "Add the tax as well", "waiting")


def test_a_job_sent_to_a_merged_worker_opens_a_worktree_and_resumes_it(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    asked_for_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET))
    story.expect_success(f'worker send --wait {agent_number(story, worker.id)} "Add the tax"', actor=story.agent)
    story.run_listeners()
    worktree = story.container.get(Queries).query(Worktree).filter(session_agent_id=worker.id).first()
    story.expect_rows(worktree is not None)
    story.expect_text(f"task show {worktree.task_id}", "Add the tax", "state: started", f"holder_id: {worker.id}", actor=story.agent)
    launcher.expect_started(worker.id, worker_session(story, worker), repository.worktree_folder(worker.id))


def ended_worker(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    return story, repository, worker


def test_a_resumed_worker_comes_back_as_a_worker_with_its_number(new_story):
    story, _, worker = ended_worker(new_story)
    session = worker_session(story, worker)
    story.hook(session, HookSamples.session_start())
    story.expect_success(f"agent show {agent_number(story, worker.id)}", "role: worker")
    story.expect_no_text(f"agent show {agent_number(story, worker.id)}", "ended_at:")


def test_a_worker_the_main_agent_stops_stays_stopped_with_its_job_waiting(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.expect_success(f"setting set {MERGER_ENABLED} false --project", actor=story.user)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.run(f'worker send --wait {agent_number(story, worker.id)} "Add the tax as well"', actor=story.agent)
    story.run_listeners()
    launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET), answer=b"stopped\n", request_count=2)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.run_listeners()
    WorkerResumeRetry()(story.container)
    story.expect_rows(launcher.requests == [{"agent_id": worker.id, "stop": True}])
    story.expect_text(f"agent-line list --agent {worker.id}", "Add the tax as well", "waiting")
    launcher.server.close()


def test_a_worker_a_person_stops_stays_stopped_with_its_job_waiting(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.expect_success(f"setting set {MERGER_ENABLED} false --project", actor=story.user)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.run(f'worker send --wait {agent_number(story, worker.id)} "Add the tax as well"', actor=story.agent)
    story.run_listeners()
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET), answer=b"stopped\n", request_count=2)
    story.expect_success(f"agent end {worker.id}", actor=user)
    story.run_listeners()
    WorkerResumeRetry()(story.container)
    story.expect_rows(launcher.requests == [{"agent_id": worker.id, "stop": True}])
    story.expect_text(f"agent-line list --agent {worker.id}", "Add the tax as well", "waiting")
    launcher.server.close()


def test_a_job_refused_because_the_program_still_runs_starts_the_worker_when_the_program_has_ended(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.advance(timedelta(seconds=5))
    launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET), answers=(b"running\n", b"started\n"), request_count=2)
    story.run(f'worker send --wait {agent_number(story, worker.id)} "Add the tax as well"', actor=story.agent)
    story.run_listeners()
    story.expect_text(f"agent-line list --agent {worker.id}", "Add the tax as well", "waiting")
    WorkerResumeRetry()(story.container)
    launcher.drain_requests()
    story.expect_rows(len(launcher.requests) == 2)
    expect_command_requests_launcher_line(launcher, "Add the tax as well")
    story.expect_text(f"agent-line list --agent {worker.id}", "Add the tax as well", "waiting")
    WorkerResumeRetry()(story.container)
    story.expect_rows(len(launcher.requests) == 2)


def test_a_job_whose_program_died_at_once_is_handed_again_by_the_next_trigger(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.advance(timedelta(seconds=5))
    story.use_processes(ProcessRow(701, 1, story.clock.timestamp()))
    launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET), answer=b"started 701\n", request_count=3)
    story.run(f'worker send --wait {agent_number(story, worker.id)} "Add the tax as well"', actor=story.agent)
    story.run_listeners()
    story.expect_rows(len(launcher.starts) == 1)
    story.advance(timedelta(minutes=3))
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.container.get(WorkerResume).resume(story.container.get(Queries).query(Agent).find(worker.id), story.agent)
    launcher.drain_requests()
    story.expect_rows(len(launcher.starts) == 2)
    expect_command_requests_launcher_line(launcher, "Add the tax as well")


def worker_starts(launcher, worker) -> list[dict[str, object]]:
    return [start for start in launcher.starts if start["agent_id"] == worker.id]


def expect_command_requests_launcher_line(launcher, expected) -> None:
    actual = launcher.starts[1]['command']
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


def test_long_worker_logs_are_marked_read_only_after_the_saved_output_is_read_whole(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_success(f'task log 1 "{"long important line " * 40}" --important', actor=worker)
    process = start_process(story, f"journal worker logs {agent_number(story, worker.id)} && echo done")
    request = CallerRequest({"JOURNAL_AGENT_SESSION": "s-1", "JOURNAL_PROCESS": str(process.id)}, str(repository.folder))
    outcome = story.run_requested(f"worker logs {agent_number(story, worker.id)}", request)
    outcome.expect_code(0)
    worktree = story.container.get(Queries).query(Worktree).filter(session_agent_id=worker.id).first()
    story.expect_rows(worktree.logs_read_at is None, worktree.logs_output_id == process.id)
    end_run(story, process, outcome.output_text)
    story.expect_success(f"output read {process.id} --summary", actor=story.agent)
    worktree = story.container.get(Queries).query(Worktree).find(worktree.id)
    story.expect_rows(worktree.logs_read_at is None)
    story.expect_success(f"output read {process.id} --all", actor=story.user)
    worktree = story.container.get(Queries).query(Worktree).find(worktree.id)
    story.expect_rows(worktree.logs_read_at is None)
    story.advance(timedelta(seconds=1))
    reader = start_process(story, f"journal output read {process.id} --all && echo done")
    request = CallerRequest({"JOURNAL_AGENT_SESSION": "s-1", "JOURNAL_PROCESS": str(reader.id)}, str(repository.folder))
    second = story.run_requested(f"output read {process.id} --all", request)
    second.expect_code(0)
    end_run(story, reader, second.output_text)
    worktree = story.container.get(Queries).query(Worktree).find(worktree.id)
    story.expect_rows(worktree.logs_read_at is None)
    story.expect_success(f"output read {reader.id} --all", actor=story.agent)
    worktree = story.container.get(Queries).query(Worktree).find(worktree.id)
    output = story.container.get(Queries).query(Output).filter(process_id=process.id).first()
    story.expect_rows(worktree.logs_read_at is not None, worktree.logs_output_id is None, output.fully_read_at is not None)


def test_redirected_worker_logs_do_not_mark_the_logs_read(new_story):
    story = install_runner(new_story(fixture=OpenTaskOrchestrator))
    worker = delivered_worker(story, repository_environment(story))
    part = ShellPart("journal", CommandCategory.JOURNAL, ["worker", "logs", str(worker.id)], subcommand="worker")
    story.expect_hook_refusal("s-1", HookSamples.shell(f"journal worker logs {agent_number(story, worker.id)} > /tmp/log", part, redirects=["> /tmp/log"]), said(READ_COMMAND_OUTPUT))
    piped = ShellPart("journal", CommandCategory.JOURNAL, ["worker", "logs", str(worker.id)], subcommand="worker", pipe_target=1)
    sink = ShellPart("cat", CommandCategory.READ, [])
    story.expect_hook_refusal("s-1", HookSamples.shell(f"journal worker logs {agent_number(story, worker.id)} && cat", piped, sink), said(READ_COMMAND_OUTPUT))
    worktree = story.container.get(Queries).query(Worktree).filter(session_agent_id=worker.id).first()
    story.expect_rows(worktree.logs_read_at is None)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_rows(story.container.get(Queries).query(Worktree).find(worktree.id).logs_read_at is not None)


def test_reading_one_task_does_not_mark_other_tasks_logs_as_read(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart total story"', actor=worker)
    story.expect_success('task log 1 "First decision" --important', actor=worker)
    task_id = story.new_row_id('task make "A second task" --brief "Add tax"', actor=story.agent)
    story.expect_success(f"worker send --wait {agent_number(story, worker.id)} --task {task_id}", actor=story.agent)
    story.expect_success(f"task start {task_id}", actor=worker)
    story.expect_success(COMMIT, actor=worker)
    repository.changed(worker.id, "tax.py", "TAX = 1\n")
    story.expect_success(f'task log {task_id} "Second decision" --important', actor=worker)
    story.expect_success(f'proof make 1 --task {task_id} "tax.py:1, read the tax"', actor=worker)
    story.expect_success("worker commit --wait --differences none", actor=worker)
    asked_for_merge(story, worker)
    story.expect_success(f"worker logs {agent_number(story, worker.id)} --task {task_id}", actor=story.agent)
    worktree = story.container.get(Queries).query(Worktree).filter(session_agent_id=worker.id).first()
    story.expect_rows(worktree.logs_read_at is None)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_rows(story.container.get(Queries).query(Worktree).find(worktree.id).logs_read_at is not None)


def test_an_explained_merge_checks_the_rows_and_merges_nothing(checked_work):
    story, repository, worker = checked_work
    repository.checkout(ENVIRONMENT_BRANCH)
    tip = repository.tip(ENVIRONMENT_BRANCH)
    story.run(f"worker merge {agent_number(story, worker.id)} --explain", actor=story.agent)
    worktree = story.story_rows(Worktree, session_agent_id=worker.id)[-1]
    story.expect_rows(repository.tip(ENVIRONMENT_BRANCH) == tip, worktree.merged_at is None, worktree.removed_at is None, detail=str(worktree))
    asked_for_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_rows(repository.tip(ENVIRONMENT_BRANCH) != tip)
