import pytest

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.drivers.support.managed_hook_runs import context_line, entry, running_journal
from tests.stories.suites.coding.modules.workers.context_limit import SESSION, LimitEnabled

HELPER_SESSION = "s-helper"
WAKE_ASK_LIMIT_SECONDS = 4


@pytest.fixture
def runs(new_story):
    with running_journal(new_story(fixture=LimitEnabled)) as journal:
        yield journal


def woken_line(story, session: str = SESSION):
    return story.wake_line(session, WAKE_ASK_LIMIT_SECONDS)


def test_an_async_hooks_output_never_reaches_the_answer(runs):
    runs.managed({"PreToolUse": [{"matcher": "Bash", "hooks": [entry(context_line("from the background"), **{"async": True})]}]})
    answer = runs.tool("Bash", {"command": "ls"})
    assert answer.returncode == 0 and "from the background" not in answer.stdout, (answer.stdout, answer.stderr)


def test_an_async_hooks_refusal_is_ignored(runs):
    runs.managed({"PreToolUse": [{"matcher": "Bash", "hooks": [entry("printf 'no' >&2; exit 2", **{"async": True})]}]})
    answer = runs.tool("Bash", {"command": "ls"})
    assert answer.returncode == 0 and '"permissionDecision":"deny"' not in answer.stdout, (answer.stdout, answer.stderr)


def test_an_asyncrewake_hook_that_exits_two_wakes_the_agent_and_one_that_exits_zero_wakes_nothing(runs):
    # the hooks end after the agent stopped, as background checks do, so a line comes to an idle agent
    runs.managed({"PostToolUse": [{"matcher": "Bash", "hooks": [entry("sleep 1; printf 'the build broke' >&2; exit 2", asyncRewake=True),
                                                                 entry("sleep 1; printf 'all fine' >&2; exit 0", asyncRewake=True)]}]})
    runs.tool("Bash", {"command": "make"}, event="PostToolUse")
    runs.story.hook(SESSION, HookSamples.stop())
    answer = woken_line(runs.story)
    runs.story.expect_wake_line(answer, "the build broke")
    runs.story.expect_rows("project hook" in answer.line, "all fine" not in answer.line, detail=str(answer))


def test_an_asyncrewake_line_for_a_helper_is_refused_and_nothing_is_typed(runs):
    story = runs.story
    story.expect_success(f"agent start {HELPER_SESSION} claude helper --parent {story.agent.id} --environment main", actor=story.user)
    runs.managed({"PostToolUse": [{"matcher": "Bash", "hooks": [entry("printf 'the build broke' >&2; exit 2", asyncRewake=True)]}]})
    runs.answer({"hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_input": {"command": "make"}, "cwd": str(runs.root)}, session=HELPER_SESSION)
    story.expect_no_wake(woken_line(story, HELPER_SESSION))
