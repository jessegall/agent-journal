import pytest

from tests.stories.core.modules.drivers.support.managed_hook_runs import entry, running_journal
from tests.stories.suites.coding.modules.workers.context_limit import LimitEnabled

HELPER_SESSION = "s-helper"
# a refused shell tool is let through rewritten to print its refusal
REFUSED_TOOL = "Project hooks refused"


@pytest.fixture
def runs(new_story):
    with running_journal(new_story(fixture=LimitEnabled)) as journal:
        yield journal


def guarded(runs, command: str, timeout: int = 10, **fields: object) -> None:
    runs.managed({"PreToolUse": [{"matcher": "Bash", "hooks": [{**entry(command, **fields), "timeout": timeout}]}]})


def test_on_failure_block_refuses_a_hook_that_times_out(runs):
    guarded(runs, "sleep 5", timeout=1, onFailure="block")
    answer = runs.tool("Bash", {"command": "ls"})
    assert REFUSED_TOOL in answer.stdout, (answer.stdout, answer.stderr)


def test_on_failure_block_refuses_a_hook_that_crashes(runs):
    guarded(runs, "exit 7", onFailure="block")
    answer = runs.tool("Bash", {"command": "ls"})
    assert REFUSED_TOOL in answer.stdout, (answer.stdout, answer.stderr)


def test_on_failure_block_refuses_unreadable_output(runs):
    guarded(runs, "printf 'not json {'", onFailure="block")
    answer = runs.tool("Bash", {"command": "ls"})
    assert REFUSED_TOOL in answer.stdout, (answer.stdout, answer.stderr)


def test_without_on_failure_a_failing_hook_only_leaves_a_note(runs):
    guarded(runs, "printf 'broke' >&2; exit 7")
    answer = runs.tool("Bash", {"command": "ls"})
    assert REFUSED_TOOL not in answer.stdout and "hook exited with code 7" in answer.stdout, (answer.stdout, answer.stderr)


def test_a_hook_that_says_continue_false_stops_the_turn(runs):
    runs.managed({"PostToolUse": [{"matcher": "Bash", "hooks": [entry("""printf '{"continue":false,"stopReason":"done"}'""")]}]})
    answer = runs.tool("Bash", {"command": "ls"}, event="PostToolUse")
    assert '"continue":false' in answer.stdout and '"stopReason":"done"' in answer.stdout, (answer.stdout, answer.stderr)


def test_a_helper_runs_managed_hooks_the_same_way_as_a_main_agent(runs):
    story = runs.story
    story.expect_success(f"agent start {HELPER_SESSION} claude helper --parent {story.agent.id} --environment main", actor=story.user)
    guarded(runs, "exit 7", onFailure="block")
    body = {"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "ls"}, "cwd": str(runs.root)}
    main, helper = runs.answer(body), runs.answer(body, session=HELPER_SESSION)
    assert REFUSED_TOOL in main.stdout and REFUSED_TOOL in helper.stdout, (main.stdout, helper.stdout)
