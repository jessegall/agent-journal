from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.support.driver_settings import ACTIVE_SLICES_SETTING
from core.modules.messages.models.message import Message
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent

WORKING_HELPER_SLICE = "working.helper"
REPORT = "The cart total was rounded twice: report filed."


def helper_reports(story, helper) -> list[Message]:
    return list(story.container.get(Queries).query(Message).filter(session_agent_id=helper.id).every_row("one test's helper"))


def test_the_allowed_stop_of_a_helper_on_a_job_hands_its_report_in_once(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    story.expect_success(f"setting set {ACTIVE_SLICES_SETTING} '[\"{WORKING_HELPER_SLICE}\"]'", actor=story.user)
    story.hook(helper.session, HookSamples.session_start())
    before = len(helper_reports(story, helper))
    story.hook(helper.session, HookSamples.stop().with_fields(raw={"last_assistant_message": REPORT}))
    reports = [message for message in helper_reports(story, helper)][before:]
    jobs = list(story.container.get(Queries).query(HelperJob).filter(helper_id=helper.id).every_row("one test's jobs"))
    assert [REPORT in message.text for message in reports] == [True] and all(job.ended_at is not None for job in jobs)
    stop = story.container.get(Queries).query(HookCall).filter(session_agent_id=helper.id, hook="stop").newest().first()
    asked = [rule["rule"] for rule in stop.metadata.values["journal.core.drivers"]["rules"]]
    assert "helpers.report" not in asked
