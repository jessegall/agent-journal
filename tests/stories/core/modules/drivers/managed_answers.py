import json

from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.base.module.driver_entries import DRIVERS_MODULE
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.samples import REMOVAL, SAMPLES

LISTING = HookSamples.shell("ls build", ShellPart("ls", CommandCategory.SEARCH, ["build"], effects=[CommandEffect.READS_FILES]))


def managed(sample, fields):
    return sample.with_fields(foreign=[{"id": "project-check", "exit_code": 0, "stdout": json.dumps(fields), "stderr": "", "milliseconds": 1, "timed_out": False}])


def test_a_project_hook_refuses_a_tool_and_the_call_names_it(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    reply = story.hook("s-1", managed(LISTING, {"hookSpecificOutput": {"permissionDecision": "deny", "permissionDecisionReason": "unsafe"}}))
    assert reply.refusal == "project-check: unsafe"
    story.expect_text(f"hook-call show {reply.hook_call_id}", "refused", "project-check")


def test_a_project_hook_refuses_a_stop(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.expect_hook_refusal("s-1", managed(HookSamples.stop(), {"decision": "block", "reason": "unfinished"}), "project-check: unfinished")


def test_a_project_hook_allow_does_not_override_a_journal_refusal(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.expect_hook_refusal("s-1", managed(REMOVAL, {"hookSpecificOutput": {"permissionDecision": "allow"}}), "the lead removes no folder")


def test_a_project_hook_rewrites_the_tool_input(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    reply = story.hook("s-1", managed(LISTING, {"hookSpecificOutput": {"updatedInput": {"command": "safe"}}}))
    assert dict(reply.updated_input) == {"command": "safe"}


def test_two_rewriters_are_refused_by_name(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run("setting make samples.rewrite true")
    reply = story.hook("s-1", managed(LISTING, {"hookSpecificOutput": {"updatedInput": {"command": "safe"}}}))
    assert "samples.shell-rewrite" in reply.refusal
    assert "project-check" in reply.refusal


def test_a_journal_refusal_comes_before_a_project_refusal(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.expect_hook_refusal("s-1", managed(REMOVAL, {"hookSpecificOutput": {"permissionDecision": "deny", "permissionDecisionReason": "foreign"}}), "the lead removes no folder")


def test_project_context_is_kept_on_a_line_event(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    reply = story.hook("s-1", managed(LISTING, {"hookSpecificOutput": {"additionalContext": "project guidance"}}))
    assert any("project guidance" in line for line in reply.lines)


def test_project_context_is_dropped_on_an_event_without_lines(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    reply = story.hook("s-1", managed(HookSamples.sample("session_end").with_fields(accepts_lines=False), {"hookSpecificOutput": {"additionalContext": "project guidance"}}))
    assert not any("project guidance" in line for line in reply.lines)
    call = story.container.get(Queries).query(HookCall).find(reply.hook_call_id)
    rules = call.metadata.module_part(DRIVERS_MODULE)["rules"]
    assert any(rule.get("rule") == "drivers.managed-hooks" and rule.get("dropped_lines") == 1 for rule in rules)
