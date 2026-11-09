import pytest

from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.modules.processes.models.process import Process
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, asking_main, dispatched_story_worker, shell_test_part, start_planned_worker


PYTHON = "--test-command python=pytest"
VITE = '--test-command "vite=npx vitest run"'
NAMED_DISPATCH = f"worker dispatch --model sonnet 1 {PYTHON} {VITE}"
BARE_DISPATCH = "worker dispatch --model sonnet 1"
PERSON_DISPATCH = "worker dispatch --program claude --model sonnet 1"
PYTHON_RUN = "worker test python tests/cart.py"


def worker_test_part(*words: str) -> ShellPart:
    return ShellPart("journal", CommandCategory.JOURNAL, ["worker", "test", *words])


@pytest.fixture
def task_story(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    UserJoined().steps(story)
    repository_environment(story)
    return story


@pytest.fixture
def named_worker(task_story, monkeypatch):
    return dispatched_story_worker(task_story, NAMED_DISPATCH, monkeypatch)


@pytest.fixture
def unnamed_worker(task_story, monkeypatch):
    task_story.run('task make "Tax" --brief "The tax" --environment main', actor=task_story.agent)
    return dispatched_story_worker_by_person(task_story, monkeypatch)


def dispatched_story_worker_by_person(story, monkeypatch):
    agent = story.agent
    story.agent = story.user
    try:
        return dispatched_story_worker(story, PERSON_DISPATCH, monkeypatch)
    finally:
        story.agent = agent


def worker_runs(worker):
    return tuple(worker.story.container.get(Queries).query(Process).filter(owner_agent_id=worker.worker.id).oldest().all_rows())


def started_lines(worker):
    return [process.line for process in worker_runs(worker)]


def test_dispatch_with_no_test_command_is_refused(task_story):
    task_story.expect_refusal(BARE_DISPATCH, "--test-command", actor=task_story.agent)
    task_story.expect_text("task show 1", "state: open", actor=task_story.agent)


def test_a_person_may_dispatch_with_no_test_command(unnamed_worker):
    unnamed_worker.story.expect_text("task show 1", "state: started", actor=unnamed_worker.story.agent)


def test_send_of_new_work_with_no_test_command_is_refused(unnamed_worker):
    unnamed_worker.story.expect_refusal(f"worker send --wait {unnamed_worker.worker.id} --task 2", "--test-command", actor=unnamed_worker.story.agent)


def test_a_send_of_new_work_may_name_the_commands(unnamed_worker):
    unnamed_worker.story.expect_success(f"worker send --wait {unnamed_worker.worker.id} --task 2 {PYTHON}", actor=unnamed_worker.story.agent)
    unnamed_worker.story.expect_text(PYTHON_RUN, "output", actor=unnamed_worker.worker)


def test_a_send_of_a_plain_job_needs_no_name(unnamed_worker):
    unnamed_worker.story.expect_success(f'worker send --wait {unnamed_worker.worker.id} "go on"', actor=unnamed_worker.story.agent)


def test_a_worker_with_names_takes_new_work_with_no_new_name(named_worker):
    named_worker.story.run('task make "Tax" --brief "The tax" --environment main', actor=named_worker.story.agent)
    named_worker.story.expect_success(f"worker send --wait {named_worker.worker.id} --task 2", actor=named_worker.story.agent)


def test_a_later_send_replaces_a_name_and_keeps_the_others(named_worker):
    named_worker.story.expect_success(f'worker send --wait {named_worker.worker.id} "go on" --test-command python=py.test', actor=named_worker.story.agent)
    named_worker.story.expect_success(PYTHON_RUN, actor=named_worker.worker)
    named_worker.story.expect_success("worker test vite src/cart.test.js", actor=named_worker.worker)
    assert started_lines(named_worker) == ["py.test tests/cart.py", "npx vitest run src/cart.test.js"]


@pytest.mark.parametrize("flags,refusal", [
    ("--test-command python=", "an empty command"),
    ("--test-command python", "name=command"),
    ("--test-command Python=pytest", "lowercase word"),
    ("--test-command py_test=pytest", "lowercase word"),
    ("--test-command python=pytest --test-command other=pytest", "two entries"),
    ("--test-command python=pytest --test-command python=py.test", "appears twice"),
], ids=["empty-command", "no-equals", "capital-name", "underscore-name", "one-command-two-names", "one-name-twice"])
def test_a_bad_test_command_is_refused_and_starts_no_worker(task_story, flags, refusal):
    task_story.expect_refusal(f"{BARE_DISPATCH} {flags}", refusal, actor=task_story.agent)
    task_story.expect_text("task show 1", "state: open", actor=task_story.agent)


def test_each_named_command_runs(named_worker):
    named_worker.story.expect_success(PYTHON_RUN, actor=named_worker.worker)
    named_worker.story.expect_success("worker test vite src/cart.test.js", actor=named_worker.worker)
    assert started_lines(named_worker) == ["pytest tests/cart.py", "npx vitest run src/cart.test.js"]


def test_a_run_takes_the_test_run_type_and_the_worker_owns_it(named_worker):
    named_worker.story.expect_success(PYTHON_RUN, actor=named_worker.worker)
    process = worker_runs(named_worker)[0]
    assert process.owner_agent_id == named_worker.worker.id
    assert process.folder == str(named_worker.repository.worktree_folder(named_worker.worker.id))


def test_an_unknown_name_is_refused_with_the_names_the_worker_has(named_worker):
    named_worker.story.expect_refusal("worker test go tests/cart.py", "python, vite", actor=named_worker.worker)
    named_worker.story.expect_refusal("worker test go tests/cart.py", "journal worker test <name> <test files>", actor=named_worker.worker)
    assert started_lines(named_worker) == []


def test_a_worker_with_no_names_is_refused_and_told_who_gives_them(unnamed_worker):
    unnamed_worker.story.expect_refusal(PYTHON_RUN, "no test command", actor=unnamed_worker.worker)


def test_only_a_worker_runs_worker_test(named_worker):
    named_worker.story.expect_refusal(PYTHON_RUN, "only a worker", actor=named_worker.story.agent)


def test_a_run_with_no_test_file_is_refused_as_the_whole_suite(named_worker):
    named_worker.story.expect_refusal("worker test python", "name each test file", actor=named_worker.worker)
    named_worker.story.expect_refusal("worker test python -q", "name each test file", actor=named_worker.worker)


@pytest.mark.parametrize("words", ["tests/a.py '|' cat", "tests/a.py ';' ls", "tests/a.py '&&' ls", "tests/a.py '||' ls", "tests/a.py '>' out", "'`ls`.py'", "'$(ls).py'",
                                   "/etc/a.py", "../a.py", "tests/a.py --rootdir=/tmp", "tests/a.py -C /tmp", "tests/a.py --prefix /tmp", "tests/a.py --cwd=/tmp", "tests/a.py --config=/tmp/x"],
                         ids=["pipe", "semicolon", "and", "or", "redirect", "backtick", "substitution", "absolute", "parent", "rootdir", "change-folder", "prefix", "cwd", "config"])
def test_an_argument_cannot_change_the_program(named_worker, words):
    named_worker.story.expect_refusal(f"worker test python {words}", "cannot change", actor=named_worker.worker)
    assert started_lines(named_worker) == []


def test_a_raw_test_command_is_refused(named_worker):
    reply = named_worker.run_line("pytest tests/cart.py", shell_test_part("pytest tests/cart.py"))
    assert "python, vite" in reply.refusal


def test_a_saved_alias_is_refused(named_worker):
    reply = named_worker.run_line("journal run-tests tests/cart.py", ShellPart("journal", CommandCategory.TEST_RUN, ["run-tests", "tests/cart.py"]))
    assert "your test commands" in reply.refusal


def test_a_second_name_for_the_same_script_is_refused(named_worker):
    reply = named_worker.run_line("scripts/run_tests.sh tests/cart.py", ShellPart("scripts/run_tests.sh", CommandCategory.TEST_RUN, ["tests/cart.py"]))
    assert "your test commands" in reply.refusal


def test_a_test_line_beside_a_worker_test_is_refused(named_worker):
    reply = named_worker.run_line("journal worker test python tests/a.py && pytest tests/b.py", worker_test_part("python", "tests/a.py"), shell_test_part("pytest tests/b.py"))
    assert "your test commands" in reply.refusal


def test_a_line_with_no_test_is_left_alone(named_worker):
    reply = named_worker.run_line("ls tests", ShellPart("ls", CommandCategory.READ, ["tests"]))
    assert reply.refusal == ""


@pytest.fixture
def phase_worker(new_story, monkeypatch):
    return start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)


def worker_test_hook(worker, *words):
    return worker.run_line("journal worker test " + " ".join(words), worker_test_part(*words))


def test_the_bound_command_keeps_its_queue_place_and_the_phase_count(phase_worker):
    before = phase_worker.status_json()["test_runs_available"]
    assert worker_test_hook(phase_worker, "python", "tests/cart.py").refusal == ""
    assert phase_worker.status_json()["test_runs_available"] == before - 1
    phase_worker.story.expect_success(PYTHON_RUN, actor=phase_worker.worker)
    assert worker_runs(phase_worker)[0].category is CommandCategory.TEST_RUN


def test_the_fourth_run_of_a_phase_is_refused(phase_worker):
    for _ in range(phase_worker.status_json()["test_runs_available"]):
        assert worker_test_hook(phase_worker, "python", "tests/cart.py").refusal == ""
    assert "phase" in worker_test_hook(phase_worker, "python", "tests/cart.py").refusal


def test_ask_main_still_reaches_the_merger_or_main_agent(phase_worker):
    for _ in range(phase_worker.status_json()["test_runs_available"]):
        worker_test_hook(phase_worker, "python", "tests/cart.py")
    worker_test_hook(phase_worker, "python", "tests/cart.py", "--ask-main", "one more")
    assert [(request.command, request.reason) for request in phase_worker.run_requests()] == [("pytest tests/cart.py", "one more")]


def test_a_flag_in_the_arguments_is_never_passed_to_the_run_as_a_request(phase_worker):
    phase_worker.story.expect_success(asking_main(PYTHON_RUN, "one more"), actor=phase_worker.worker)
    assert started_lines(phase_worker) == ["pytest tests/cart.py"]


def test_a_proof_takes_a_name_and_an_unknown_name_is_refused_when_made(named_worker):
    named_worker.story.expect_refusal('proof make 1 --task 1 "cart.py:1, the story" --test "go tests/cart.py"', "python, vite", actor=named_worker.worker)
    named_worker.story.expect_success('proof make 1 --task 1 "cart.py:1, the story" --test "python tests/cart.py"', actor=named_worker.worker)
    named_worker.story.expect_text("proof show 1", "test_command: pytest tests/cart.py", actor=named_worker.story.agent)


def test_a_proof_with_a_raw_line_is_refused(named_worker):
    named_worker.story.expect_refusal('proof make 1 --task 1 "cart.py:1, the story" --test "pytest tests/cart.py"', "python, vite", actor=named_worker.worker)


def test_a_proof_must_name_its_test_files_by_name_too(named_worker):
    named_worker.story.expect_refusal('proof make 1 --task 1 "cart.py:1, the story" --test "python"', "name each test file", actor=named_worker.worker)


def test_a_proof_argument_cannot_change_the_program(named_worker):
    named_worker.story.expect_refusal('proof make 1 --task 1 "cart.py:1, the story" --test "python ../a.py"', "cannot change", actor=named_worker.worker)
