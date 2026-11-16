from tests.stories.support.story_checks import expect_true
import json

import pytest

from tests.stories.core.modules.drivers.support.managed_hook_runs import context_line, entry, running_journal
from tests.stories.suites.coding.modules.workers.context_limit import LimitEnabled

PROJECT_CHECK = json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse", "additionalContext": "argument $HOME kept"}})


@pytest.fixture
def runs(new_story):
    with running_journal(new_story(fixture=LimitEnabled)) as journal:
        yield journal


def test_a_project_hook_with_args_runs_its_program_with_those_arguments_and_no_shell(runs):
    runs.managed({"PreToolUse": [{"matcher": "Bash", "hooks": [entry("printf", args=["%s", PROJECT_CHECK])]}]})
    answer = runs.tool("Bash", {"command": "ls"})
    expect_true(answer.returncode == 0 and "argument $HOME kept" in answer.stdout, (answer.stdout, answer.stderr))


def test_a_project_hook_with_a_shell_runs_through_that_shell(runs):
    runs.managed({"PreToolUse": [{"matcher": "Bash", "hooks": [entry('[[ "a" == a ]] && ' + context_line("ran in bash"), shell="bash")]}]})
    answer = runs.tool("Bash", {"command": "ls"})
    expect_true("ran in bash" in answer.stdout, (answer.stdout, answer.stderr))


def test_a_project_hook_with_an_if_condition_runs_only_when_it_holds(runs):
    runs.managed({"PreToolUse": [{"matcher": "Bash", "hooks": [entry(context_line("git check ran"), **{"if": "Bash(git *)"})]}]})
    second = runs.tool("Bash", {"command": "npm test"})
    matching = runs.tool("Bash", {"command": "ls && git status"})
    expect_true("git check ran" not in second.stdout and "git check ran" in matching.stdout, (second.stdout, matching.stdout))


def test_a_project_hook_with_a_matcher_runs_only_for_the_tools_it_names(runs):
    runs.managed({"PreToolUse": [{"matcher": "Edit", "hooks": [entry(context_line("edit check ran"))]}]})
    longer_name = runs.tool("MultiEdit", {"file_path": str(runs.root / "cart.py")})
    listed = runs.tool("Edit", {"file_path": str(runs.root / "cart.py")})
    expect_true("edit check ran" not in longer_name.stdout and "edit check ran" in listed.stdout, (longer_name.stdout, listed.stdout))
