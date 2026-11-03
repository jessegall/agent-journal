from core.base.module.driver_entries import DRIVERS_MODULE
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.samples import SAMPLES


def test_a_hook_call_keeps_each_foreign_result_in_its_drivers_metadata(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    runs = [
        {"id": "first", "exit_code": 2, "stdout": "blocked", "stderr": "details", "milliseconds": 17, "timed_out": False, "answer": {"refusal": "details"}},
        {"id": "second", "exit_code": -1, "stdout": "", "stderr": "", "milliseconds": 1000, "timed_out": True, "answer": {"terminal": "second: hook timed out"}},
    ]
    story.hook("s-1", HookSamples.stop().with_fields(firing="foreign-results", foreign=runs))
    calls = list(story.container.get(Queries).query(HookCall).filter(firing="foreign-results").all_rows())
    story.expect_rows(len(calls) == 1)
    story.expect_rows(calls[0].metadata.module_part(DRIVERS_MODULE)["foreign"] == runs)


def test_a_hook_call_keeps_an_empty_foreign_list(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.hook("s-1", HookSamples.stop().with_fields(firing="empty-foreign"))
    calls = list(story.container.get(Queries).query(HookCall).filter(firing="empty-foreign").all_rows())
    story.expect_rows(len(calls) == 1)
    story.expect_rows(calls[0].metadata.module_part(DRIVERS_MODULE)["foreign"] == [])
