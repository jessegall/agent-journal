import pytest

from core.base.module.driver_entries import DRIVERS_MODULE
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.samples import SAMPLES


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
    assert reply.refusal == ""
    assert reply.terminal.splitlines() == [terminal]
    assert dict(reply.updated_input) == {}
    call = story.container.get(Queries).query(HookCall).find(reply.hook_call_id)
    assert call.metadata.module_part(DRIVERS_MODULE)["foreign"] == runs
    assert story.hook("s-1", hook).terminal == terminal
