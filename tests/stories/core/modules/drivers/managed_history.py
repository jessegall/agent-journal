from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.provider.managed_hook import ManagedHook
from core.modules.drivers.conditions.foreign_hook import ForeignHook
from core.base.driver.foreign_outcome import ForeignOutcome
from core.modules.drivers.queries.managed_hook_history_query import ManagedHookHistoryQuery
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.samples import SAMPLES
from core.testing.expect_row import expect_row


def test_history_counts_each_outcome_and_returns_the_last_run(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    hook = ManagedHook.found("claude", "PreToolUse", "Bash", {"command": "check"}, "settings.json", False)
    samples = [(2, "", False, ForeignOutcome.REFUSED), (0, '{"hookSpecificOutput":{"updatedInput":{"command":"safe"}}}', False, ForeignOutcome.REWRITTEN),
               (7, "", False, ForeignOutcome.FAILED), (-1, "", True, ForeignOutcome.TIMEOUT), (0, "{}", False, ForeignOutcome.ALLOWED)]
    for index, (exit_code, stdout, timed_out, outcome) in enumerate(samples):
        answer = {"refusal": "details"} if outcome is ForeignOutcome.REFUSED else {"updated_input": {"command": "safe"}} if outcome is ForeignOutcome.REWRITTEN else {}
        run = {"id": hook.id, "exit_code": exit_code, "stdout": stdout, "stderr": "details", "milliseconds": index, "timed_out": timed_out, "answer": answer}
        story.hook("s-1", HookSamples.edit("cart.py").with_fields(firing=f"managed-{index}", foreign=[run]))
        expect_last_outcome(story, hook, outcome)
    history = story.container.get(ManagedHookHistoryQuery).read(hook)
    expect_row(history, runs=5, refused=1, rewritten=1, failed=1, timed_out=1)
    expect_row(history.last, id=hook.id)
    expect_row(history.last, milliseconds=4)


def test_a_hook_without_runs_has_empty_history(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    hook = ManagedHook.found("claude", "PreToolUse", "Bash", {"command": "never"}, "settings.json", False)
    history = story.container.get(ManagedHookHistoryQuery).read(hook)
    expect_row(history, runs=0, refused=0, rewritten=0, failed=0, timed_out=0)
    expect_row(history, last=None)


def test_history_reads_the_last_hundred_runs_of_this_hook(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    hook = ManagedHook.found("claude", "PreToolUse", "Bash", {"command": "bounded"}, "settings.json", False)
    for index in range(102):
        run = {"id": hook.id, "exit_code": 7 if index == 0 else 0, "stdout": "{}", "stderr": "", "milliseconds": index, "timed_out": False, "answer": {}}
        story.hook("s-1", HookSamples.edit("cart.py").with_fields(firing=f"bounded-{index}", foreign=[run]))
    unrelated = {"id": "different-hook", "exit_code": 7, "stdout": "", "stderr": "", "milliseconds": 200, "timed_out": False, "answer": {}}
    story.hook("s-1", HookSamples.stop().with_fields(firing="different-hook", foreign=[unrelated]))
    history = story.container.get(ManagedHookHistoryQuery).read(hook)
    expect_row(history, runs=100)
    expect_row(history, failed=0)
    expect_row(history.last, milliseconds=101)


def test_the_read_of_a_hooks_history_walks_only_the_calls_that_ran_a_project_hook(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    hook = ManagedHook.found("claude", "PreToolUse", "Bash", {"command": "indexed"}, "settings.json", False)
    for index in range(40):
        story.hook("s-1", HookSamples.edit("cart.py").with_fields(firing=f"quiet-{index}", foreign=[]))
    run = {"id": hook.id, "exit_code": 0, "stdout": "{}", "stderr": "", "milliseconds": 1, "timed_out": False, "answer": {}}
    story.hook("s-1", HookSamples.edit("cart.py").with_fields(firing="ran", foreign=[run]))
    condition = ForeignHook(hook.id).statement()
    plan = " ".join(str(row[3]) for row in story.container.get(Database).rows(Statement(f"EXPLAIN QUERY PLAN SELECT * FROM hook_calls WHERE {condition.sql} ORDER BY id DESC LIMIT 100", condition.parameters)))
    assert "hook_calls_foreign_runs" in plan, plan
    expect_row(story.container.get(ManagedHookHistoryQuery).read(hook), runs=1)


def expect_last_outcome(story, hook, expected) -> None:
    actual = story.container.get(ManagedHookHistoryQuery).read(hook).last_outcome
    assert actual is expected, actual
