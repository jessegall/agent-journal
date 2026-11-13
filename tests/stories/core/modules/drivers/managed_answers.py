from engine.enums.command_category import CommandCategory
from engine.enums.command_effect import CommandEffect
from engine.module.driver_entries import DRIVERS_MODULE
from engine.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.engine.driver.support.fixtures import LeadStarted
from tests.stories.engine.driver.support.samples import REMOVAL, SAMPLES
from engine.testing.expectations.expect_reply import expect_absent_reply_line, expect_reply_line, expect_reply_refusal
from core.modules.drivers.support.driver_nudges import MANAGED_HOOK_REFUSAL
from engine.testing.expectations.said_nudge import said
LISTING = HookSamples.shell("ls build", ShellPart("ls", CommandCategory.SEARCH, ["build"], effects=[CommandEffect.READS_FILES]))


def managed(sample, answer):
    return sample.with_fields(foreign=[{"id": "project-check", "exit_code": 0, "stdout": "", "stderr": "", "milliseconds": 1, "timed_out": False, "answer": answer}])


def test_a_project_hook_refuses_a_tool_and_the_call_names_it(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    reply = story.hook("s-1", managed(LISTING, {"refusal": "unsafe"}))
    expect_reply_refusal(reply, "Project hooks refused for agent:")
    story.expect_text(f"agent-line list --agent {story.agent.id}", "project-check: unsafe", actor=story.agent)
    story.expect_text(f"hook-call show {reply.hook_call_id}", "refused", "drivers.managed-hooks")


def test_a_project_hook_refuses_a_stop(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.expect_hook_refusal("s-1", managed(HookSamples.stop(), {"refusal": "unfinished"}), said(MANAGED_HOOK_REFUSAL))
    story.expect_text(f"agent-line list --agent {story.agent.id}", "project-check: unfinished", actor=story.agent)


def test_two_rewriters_are_refused_by_name(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run("setting set samples.rewrite true --project")
    reply = story.hook("s-1", managed(LISTING, {"updated_input": {"command": "safe"}}))
    expect_reply_refusal(reply, "samples.shell-rewrite")
    expect_reply_refusal(reply, "project-check")


def test_project_context_is_kept_on_a_line_event(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    reply = story.hook("s-1", managed(LISTING, {"lines": ["project guidance"]}))
    expect_reply_line(reply, "project guidance")
    expect_absent_reply_line(reply, "project hooks answered for agent:")
    story.expect_text(f"agent-line list --agent {story.agent.id}", "project guidance", actor=story.agent)


def test_project_context_is_dropped_on_an_event_without_lines(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    reply = story.hook("s-1", managed(HookSamples.sample("session_end").with_fields(accepts_lines=False), {"lines": ["project guidance"]}))
    expect_absent_reply_line(reply, "project guidance")
    call = story.container.get(Queries).query(HookCall).find(reply.hook_call_id)
    rules = call.metadata.module_part(DRIVERS_MODULE)["rules"]
    expect_rule_rules("rule", "drivers.managed-hooks", "dropped_lines", 1, rules)


def expect_rule_rules(text, text_2, text_3, number, rules) -> None:
    actual = any((rule.get(text) == text_2 and rule.get(text_3) == number for rule in rules))
    assert actual, actual
