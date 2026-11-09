import subprocess

import pytest

from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.processes.support.missing_runner_error import MissingRunnerError
from core.modules.processes.support.runner_binary import RunnerBinary
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, dispatched_story_worker, shell_test_part, start_planned_worker
from tests.stories.support.story_checks import expect_value, expect_value_with
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch


REAL_WORKER_TEST_START_WAITED = WorkerTestLaunch.start_waited
PYTHON = "--test-command python=pytest"
VITE = '--test-command "vite=npx vitest run"'
COMMANDS_DISPATCH = f"worker dispatch --model sonnet 1 {PYTHON} {VITE}"
BARE_DISPATCH = "worker dispatch --model sonnet 1"
PERSON_DISPATCH = "worker dispatch --program claude --model sonnet 1"
PYTHON_RUN = "worker test python tests/cart.py"


def worker_test_part(*test_arguments: str) -> ShellPart:
    return ShellPart("journal", CommandCategory.JOURNAL, ["worker", "test", *test_arguments])


@pytest.fixture
def task_story(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    UserJoined().steps(story)
    repository_environment(story)
    return story


@pytest.fixture
def worker_with_commands(task_story, monkeypatch):
    return dispatched_story_worker(task_story, COMMANDS_DISPATCH, monkeypatch)


@pytest.fixture
def runner_starts(worker_with_commands, monkeypatch):
    """Every start of the real runner, by the real launch that a dispatched story worker otherwise has faked."""
    starts = []
    monkeypatch.setattr(WorkerTestLaunch, "start_waited", REAL_WORKER_TEST_START_WAITED)
    monkeypatch.setattr(RunnerBinary, "is_installed", lambda _runner: True)
    monkeypatch.setattr(subprocess, "Popen", lambda command, **options: starts.append((command, options)))
    return starts


@pytest.fixture
def worker_without_commands(task_story, monkeypatch):
    task_story.run('task make "Tax" --brief "The tax" --environment main', actor=task_story.agent)
    return person_dispatched_worker(task_story, monkeypatch)


def person_dispatched_worker(story, monkeypatch):
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


def test_a_named_test_run_starts_through_the_runner_in_the_worktree_once_it_is_saved(worker_with_commands, runner_starts, monkeypatch):
    worker_with_commands.story.expect_success(PYTHON_RUN, actor=worker_with_commands.worker)
    worker_with_commands.story.run_listeners()
    process = worker_runs(worker_with_commands)[-1]
    command, options = runner_starts[0]
    expect_value_with(command, f"--process {process.id}")
    expect_value_with(command, "pytest tests/cart.py")
    expect_value(options["cwd"], str(worker_with_commands.repository.worktree_folder(worker_with_commands.worker.id)))
    monkeypatch.setattr(RunnerBinary, "is_installed", lambda _runner: False)
    with pytest.raises(MissingRunnerError, match="not installed"):
        worker_with_commands.story.container.get(WorkerTestLaunch).start_waited(process, "pytest tests/cart.py", "s-1")


def test_a_named_test_run_with_a_counting_reader_starts_with_its_count(worker_with_commands, runner_starts):
    worker_with_commands.story.expect_success('reader add counted --commands "pytest*" --title Testing --lines done --summary done --step PASSED --count "collected ([0-9]+)" --count-command "{part} --collect-only"', actor=worker_with_commands.story.user)
    worker_with_commands.story.expect_success(PYTHON_RUN, actor=worker_with_commands.worker)
    worker_with_commands.story.run_listeners()
    command, _ = runner_starts[0]
    expect_value_with(command, "--count")
    expect_value_with(command, "pytest tests/cart.py --collect-only")


def test_dispatch_with_no_test_command_is_refused(task_story):
    task_story.expect_refusal(BARE_DISPATCH, "--test-command", actor=task_story.agent)
    task_story.expect_text("task show 1", "state: open", actor=task_story.agent)


def test_a_person_may_dispatch_with_no_test_command(worker_without_commands):
    worker_without_commands.story.expect_text("task show 1", "state: started", actor=worker_without_commands.story.agent)


def test_send_of_new_work_with_no_test_command_is_refused(worker_without_commands):
    worker_without_commands.story.expect_refusal(f"worker send --wait {worker_without_commands.worker.id} --task 2", "--test-command", actor=worker_without_commands.story.agent)


def test_a_send_of_new_work_may_name_the_commands(worker_without_commands):
    worker_without_commands.story.expect_success(f"worker send --wait {worker_without_commands.worker.id} --task 2 {PYTHON}", actor=worker_without_commands.story.agent)
    worker_without_commands.story.expect_text(PYTHON_RUN, "output", actor=worker_without_commands.worker)


def test_a_send_of_a_plain_job_needs_no_name(worker_without_commands):
    worker_without_commands.story.expect_success(f'worker send --wait {worker_without_commands.worker.id} "go on"', actor=worker_without_commands.story.agent)


def test_a_worker_with_names_takes_new_work_with_no_new_name(worker_with_commands):
    worker_with_commands.story.run('task make "Tax" --brief "The tax" --environment main', actor=worker_with_commands.story.agent)
    worker_with_commands.story.expect_success(f"worker send --wait {worker_with_commands.worker.id} --task 2", actor=worker_with_commands.story.agent)


def test_a_later_send_replaces_a_name_and_keeps_the_others(worker_with_commands):
    worker_with_commands.story.expect_success(f'worker send --wait {worker_with_commands.worker.id} "go on" --test-command python=py.test', actor=worker_with_commands.story.agent)
    worker_with_commands.story.expect_success(PYTHON_RUN, actor=worker_with_commands.worker)
    worker_with_commands.story.expect_success("worker test vite src/cart.test.js", actor=worker_with_commands.worker)
    expect_value(started_lines(worker_with_commands), ["py.test tests/cart.py", "npx vitest run src/cart.test.js"])


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


def test_each_named_command_runs(worker_with_commands):
    worker_with_commands.story.expect_success(PYTHON_RUN, actor=worker_with_commands.worker)
    worker_with_commands.story.expect_success("worker test vite src/cart.test.js", actor=worker_with_commands.worker)
    expect_value(started_lines(worker_with_commands), ["pytest tests/cart.py", "npx vitest run src/cart.test.js"])


def test_a_run_takes_the_test_run_type_and_the_worker_owns_it(worker_with_commands):
    worker_with_commands.story.expect_success(PYTHON_RUN, actor=worker_with_commands.worker)
    process = worker_runs(worker_with_commands)[0]
    expect_value(process.owner_agent_id, worker_with_commands.worker.id)
    expect_value(process.folder, str(worker_with_commands.repository.worktree_folder(worker_with_commands.worker.id)))


def test_an_unknown_name_is_refused_with_the_names_the_worker_has(worker_with_commands):
    worker_with_commands.story.expect_refusal("worker test go tests/cart.py", "python, vite", actor=worker_with_commands.worker)
    worker_with_commands.story.expect_refusal("worker test go tests/cart.py", "journal worker test <name> <test files>", actor=worker_with_commands.worker)
    expect_value(started_lines(worker_with_commands), [])


def test_a_worker_with_no_names_is_refused_and_told_who_gives_them(worker_without_commands):
    worker_without_commands.story.expect_refusal(PYTHON_RUN, "no test command", actor=worker_without_commands.worker)


@pytest.mark.parametrize("line, part", [
    ("pytest tests/cart.py", shell_test_part("pytest tests/cart.py")),
    ("journal run-tests tests/cart.py", ShellPart("journal", CommandCategory.TEST_RUN, ["run-tests", "tests/cart.py"])),
])
def test_a_test_line_of_a_worker_with_no_commands_says_it_has_none_and_who_gives_them(worker_without_commands, line, part):
    reply = worker_without_commands.run_line(line, part)
    expect_value_with(reply.refusal, "You have no test commands")
    expect_value_with(reply.refusal, f"journal worker send {worker_without_commands.worker.id} --test-command")


def test_the_status_of_a_worker_with_no_commands_promises_no_test_runs(worker_without_commands):
    status = worker_without_commands.story.run("worker status", actor=worker_without_commands.worker).output_text
    expect_value_with(status, "Own test runs left: 0")
    worker_without_commands.story.expect_no_text("worker status", "no limit", actor=worker_without_commands.worker)


def test_only_a_worker_runs_worker_test(worker_with_commands):
    worker_with_commands.story.expect_refusal(PYTHON_RUN, "only a worker", actor=worker_with_commands.story.agent)


def test_a_run_with_no_test_file_is_refused_as_the_whole_suite(worker_with_commands):
    worker_with_commands.story.expect_refusal("worker test python", "name each test file", actor=worker_with_commands.worker)
    worker_with_commands.story.expect_refusal("worker test python -q", "name each test file", actor=worker_with_commands.worker)


@pytest.mark.parametrize("test_arguments", ["tests/a.py '|' cat", "tests/a.py ';' ls", "tests/a.py '&&' ls", "tests/a.py '||' ls", "tests/a.py '>' out", "'`ls`.py'", "'$(ls).py'",
                                   "/etc/a.py", "../a.py", "tests/a.py --rootdir=/tmp", "tests/a.py -C /tmp", "tests/a.py --prefix /tmp", "tests/a.py --cwd=/tmp", "tests/a.py --config=/tmp/x"],
                         ids=["pipe", "semicolon", "and", "or", "redirect", "backtick", "substitution", "absolute", "parent", "rootdir", "change-folder", "prefix", "cwd", "config"])
def test_an_argument_cannot_change_the_program(worker_with_commands, test_arguments):
    worker_with_commands.story.expect_refusal(f"worker test python {test_arguments}", "cannot change", actor=worker_with_commands.worker)
    expect_value(started_lines(worker_with_commands), [])


def test_a_raw_test_command_is_refused(worker_with_commands):
    reply = worker_with_commands.run_line("pytest tests/cart.py", shell_test_part("pytest tests/cart.py"))
    expect_value_with(reply.refusal, "python, vite")


def test_a_saved_alias_is_refused(worker_with_commands):
    reply = worker_with_commands.run_line("journal run-tests tests/cart.py", ShellPart("journal", CommandCategory.TEST_RUN, ["run-tests", "tests/cart.py"]))
    expect_value_with(reply.refusal, "your test commands")


def test_a_second_name_for_the_same_script_is_refused(worker_with_commands):
    reply = worker_with_commands.run_line("scripts/run_tests.sh tests/cart.py", ShellPart("scripts/run_tests.sh", CommandCategory.TEST_RUN, ["tests/cart.py"]))
    expect_value_with(reply.refusal, "your test commands")


def test_a_test_line_beside_a_worker_test_is_refused(worker_with_commands):
    reply = worker_with_commands.run_line("journal worker test python tests/a.py && pytest tests/b.py", worker_test_part("python", "tests/a.py"), shell_test_part("pytest tests/b.py"))
    expect_value_with(reply.refusal, "your test commands")


@pytest.mark.parametrize("program, category, arguments", [
    ("sh", CommandCategory.PROCESS, ["hidden.sh"]), ("bash", CommandCategory.PROCESS, ["hidden.sh"]), ("python3", CommandCategory.PROCESS, ["hidden.py"]),
    ("python3", CommandCategory.PROCESS, ["-c", "import pytest; pytest.main([])"]), ("node", CommandCategory.PROCESS, ["node_modules/vitest/vitest.mjs", "run"]),
    ("coverage", CommandCategory.UNKNOWN, ["run", "-m", "pytest"]), ("./hidden.sh", CommandCategory.UNKNOWN, []),
])
def test_a_test_hidden_in_a_script_or_an_interpreter_is_refused_with_the_program(worker_with_commands, program, category, arguments):
    reply = worker_with_commands.run_line(" ".join([program, *arguments]), ShellPart(program, category, arguments))
    expect_value_with(reply.refusal, f"a worker here runs no {category.value} command")


def test_a_line_with_no_test_is_left_alone(worker_with_commands):
    reply = worker_with_commands.run_line("ls tests", ShellPart("ls", CommandCategory.READ, ["tests"]))
    expect_value(reply.refusal, "")


@pytest.fixture
def phase_worker(new_story, monkeypatch):
    return start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)


def worker_test_hook(worker, *test_arguments):
    return worker.run_line("journal worker test " + " ".join(test_arguments), worker_test_part(*test_arguments))


def test_the_bound_command_keeps_its_queue_place_and_the_phase_count(phase_worker):
    runs_at_start = phase_worker.status_json()["test_runs_available"]
    expect_value(worker_test_hook(phase_worker, "python", "tests/cart.py").refusal, "")
    expect_value(phase_worker.status_json()["test_runs_available"], runs_at_start - 1)
    phase_worker.story.expect_success(PYTHON_RUN, actor=phase_worker.worker)
    expect_value(worker_runs(phase_worker)[0].category is CommandCategory.TEST_RUN, True)


def test_the_fourth_run_of_a_phase_is_refused(phase_worker):
    for _ in range(phase_worker.status_json()["test_runs_available"]):
        expect_value(worker_test_hook(phase_worker, "python", "tests/cart.py").refusal, "")
    expect_value_with(worker_test_hook(phase_worker, "python", "tests/cart.py").refusal, "phase")


def test_a_proof_takes_a_name_and_an_unknown_name_is_refused_when_made(worker_with_commands):
    worker_with_commands.story.expect_refusal('proof make 1 --task 1 "cart.py:1, the story" --test "go tests/cart.py"', "python, vite", actor=worker_with_commands.worker)
    worker_with_commands.story.expect_success('proof make 1 --task 1 "cart.py:1, the story" --test "python tests/cart.py"', actor=worker_with_commands.worker)
    worker_with_commands.story.expect_text("proof show 1", "test_command: pytest tests/cart.py", actor=worker_with_commands.story.agent)


def test_a_proof_with_a_raw_line_is_refused(worker_with_commands):
    worker_with_commands.story.expect_refusal('proof make 1 --task 1 "cart.py:1, the story" --test "pytest tests/cart.py"', "python, vite", actor=worker_with_commands.worker)


def test_a_proof_must_name_its_test_files_by_name_too(worker_with_commands):
    worker_with_commands.story.expect_refusal('proof make 1 --task 1 "cart.py:1, the story" --test "python"', "name each test file", actor=worker_with_commands.worker)


def test_a_proof_argument_cannot_change_the_program(worker_with_commands):
    worker_with_commands.story.expect_refusal('proof make 1 --task 1 "cart.py:1, the story" --test "python ../a.py"', "cannot change", actor=worker_with_commands.worker)
