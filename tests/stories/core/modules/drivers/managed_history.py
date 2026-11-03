from core.base.provider.managed_hook import ManagedHook
from core.base.driver.foreign_outcome import ForeignOutcome
from core.modules.drivers.queries.managed_hook_history_query import ManagedHookHistoryQuery
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.samples import SAMPLES


def test_history_counts_each_outcome_and_returns_the_last_run(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    hook = ManagedHook.found("claude", "PreToolUse", "Bash", {"command": "check"}, "settings.json", False)
    samples = [(2, "", False, ForeignOutcome.REFUSED), (0, '{"hookSpecificOutput":{"updatedInput":{"command":"safe"}}}', False, ForeignOutcome.REWRITTEN),
               (7, "", False, ForeignOutcome.FAILED), (-1, "", True, ForeignOutcome.TIMEOUT), (0, "{}", False, ForeignOutcome.ALLOWED)]
    for index, (exit_code, stdout, timed_out, outcome) in enumerate(samples):
        run = {"id": hook.id, "exit_code": exit_code, "stdout": stdout, "stderr": "details", "milliseconds": index, "timed_out": timed_out}
        story.hook("s-1", HookSamples.edit("cart.py").with_fields(firing=f"managed-{index}", foreign=[run]))
        assert story.container.get(ManagedHookHistoryQuery).read(hook).last_outcome is outcome
    history = story.container.get(ManagedHookHistoryQuery).read(hook)
    assert (history.runs, history.refused, history.rewritten, history.failed, history.timed_out) == (5, 1, 1, 1, 1)
    assert history.last.id == hook.id and history.last.milliseconds == 4


def test_a_hook_without_runs_has_empty_history(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    hook = ManagedHook.found("claude", "PreToolUse", "Bash", {"command": "never"}, "settings.json", False)
    history = story.container.get(ManagedHookHistoryQuery).read(hook)
    assert (history.runs, history.refused, history.rewritten, history.failed, history.timed_out) == (0, 0, 0, 0, 0)
    assert history.last is None


def test_history_reads_the_last_hundred_runs_of_this_hook(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    hook = ManagedHook.found("claude", "PreToolUse", "Bash", {"command": "bounded"}, "settings.json", False)
    for index in range(102):
        run = {"id": hook.id, "exit_code": 7 if index == 0 else 0, "stdout": "{}", "stderr": "", "milliseconds": index, "timed_out": False}
        story.hook("s-1", HookSamples.edit("cart.py").with_fields(firing=f"bounded-{index}", foreign=[run]))
    unrelated = {"id": "different-hook", "exit_code": 7, "stdout": "", "stderr": "", "milliseconds": 200, "timed_out": False}
    story.hook("s-1", HookSamples.stop().with_fields(firing="different-hook", foreign=[unrelated]))
    history = story.container.get(ManagedHookHistoryQuery).read(hook)
    assert history.runs == 100 and history.failed == 0
    assert history.last.milliseconds == 101
