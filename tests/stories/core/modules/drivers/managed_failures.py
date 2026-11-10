import pytest

from engine.module.driver_entries import DRIVERS_MODULE
from engine.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.testing.hook_samples import HookSamples
from tests.stories.engine.driver.support.fixtures import LeadStarted
from tests.stories.engine.driver.support.samples import SAMPLES
from core.testing.expect_reply import expect_reply_allowed
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_updated_input_reply


@pytest.mark.parametrize("exit_code,timed_out,terminal", [(7, False, "project-check: hook exited with code 7: details"),
                                                       (-1, True, "project-check: hook timed out"),
                                                       (-1, False, "project-check: hook exited with code -1: details")])
@pytest.mark.parametrize("sample", [HookSamples.edit("src/cart.py"), HookSamples.stop()])
def test_a_failed_project_hook_never_refuses_and_keeps_its_diagnostic_and_outcome(new_story, exit_code, timed_out, terminal, sample):
    story = new_story(SAMPLES, fixture=LeadStarted)
    runs = [{"id": "project-check", "exit_code": exit_code, "stdout": '{"decision":"block","reason":"ignored"}',
             "stderr": "details", "milliseconds": 1000, "timed_out": timed_out, "answer": {"terminal": terminal}}]
    hook = sample.with_fields(firing="failed-managed-hook", foreign=runs)
    reply = story.hook("s-1", hook)
    expect_reply_allowed(reply)
    expect_terminal_reply(reply, [terminal])
    expect_updated_input_reply(reply, {})
    call = story.container.get(Queries).query(HookCall).find(reply.hook_call_id)
    expect_row(call.metadata.module_part(DRIVERS_MODULE), foreign=runs)
    expect_terminal_hook(story, "s-1", hook, terminal)


def expect_terminal_hook(story, text, hook, expected) -> None:
    actual = story.hook(text, hook).terminal
    assert actual == expected, actual


def expect_terminal_reply(reply, expected) -> None:
    actual = reply.terminal.splitlines()
    assert actual == expected, actual
