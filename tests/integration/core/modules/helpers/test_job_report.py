from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.models.enums.handover_state import HandoverState
from core.modules.helpers.nudges.unsaved_report_message import UnsavedReportMessage
from core.modules.messages.commands.record_parent_report.record_parent_report_handler import RecordParentReportHandler
from core.modules.messages.models.message import Message
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent

REPORT = "The cart total was rounded twice: report filed."


def helper_reports(story, helper) -> list[Message]:
    return list(story.container.get(Queries).query(Message).filter(session_agent_id=helper.id).every_row("one test's helper"))


def test_the_allowed_stop_of_a_helper_on_a_job_hands_its_report_in_once(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    story.hook(helper.session, HookSamples.session_start())
    before = len(helper_reports(story, helper))
    story.hook(helper.session, HookSamples.stop().with_fields(raw={"last_assistant_message": REPORT}))
    reports = [message for message in helper_reports(story, helper)][before:]
    jobs = list(story.container.get(Queries).query(HelperJob).filter(helper_id=helper.id).every_row("one test's jobs"))
    assert [REPORT in message.text for message in reports] == [True] and all(job.ended_at is not None for job in jobs)
    stop = story.container.get(Queries).query(HookCall).filter(session_agent_id=helper.id, hook="stop").newest().first()
    asked = [rule["rule"] for rule in stop.metadata.values["journal.core.drivers"]["rules"]]
    assert "helpers.report" not in asked


class FailingReport(RecordParentReportHandler):
    """A report save that fails, as a full disk would make it."""

    def __init__(self) -> None:
        pass

    def handle(self, command, context):
        raise Refusal("the report could not be written")


def stop_twice_with_a_failing_save(story, helper):
    story.hook(helper.session, HookSamples.session_start())
    story.replace(RecordParentReportHandler, FailingReport())
    first = story.hook(helper.session, HookSamples.stop().with_fields(raw={"last_assistant_message": REPORT}, firing="report-1"))
    second = story.hook(helper.session, HookSamples.stop().with_fields(raw={"last_assistant_message": REPORT}, firing="report-2"))
    return first, second


def test_a_report_whose_save_fails_refuses_the_stop_once_then_keeps_its_text_and_lets_the_helper_rest(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    first, second = stop_twice_with_a_failing_save(story, helper)
    job = story.container.get(Queries).query(HelperJob).filter(helper_id=helper.id).newest().first()
    assert first.refusal == UnsavedReportMessage.declared().nudge().text and not second.refusal
    assert (job.handover_state, job.failed_text, job.ended_at) == (HandoverState.CAPTURE_FAILED, REPORT, None)


def test_a_kept_report_is_saved_again_by_its_retry_once_the_save_works(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    stop_twice_with_a_failing_save(story, helper)
    story.container.rebuild(RecordParentReportHandler, RecordParentReportHandler)
    story.expect_success(f"helper report-retry {helper.number}", actor=story.user)
    job = story.container.get(Queries).query(HelperJob).filter(helper_id=helper.id).newest().first()
    assert (job.handover_state, job.returned, job.ended_at is not None) == (HandoverState.COMPLETED, REPORT, True)


def test_a_dropped_kept_report_ends_its_job_with_no_report(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    stop_twice_with_a_failing_save(story, helper)
    story.expect_success(f"helper report-drop {helper.number}", actor=story.user)
    job = story.container.get(Queries).query(HelperJob).filter(helper_id=helper.id).newest().first()
    assert (job.handover_state, job.ended_at is not None) == (HandoverState.NO_REPORT, True)
