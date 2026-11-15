from engine.query.queries import Queries
from core.modules.drivers.models.agent_step_request import AgentStepRequest
from core.modules.drivers.ticks.agent_step_round import AgentStepRound
from engine.testing.examples.hook_samples import HookSamples
from core.modules.drivers.support.contribution_slices import WAITING_SLICE
from core.modules.drivers.support.driver_settings import ACTIVE_SLICES_SETTING
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent

STEP_CAUSE = "messages.message-step"


def requests(story, agent_id: int) -> list[AgentStepRequest]:
    return list(story.container.get(Queries).query(AgentStepRequest).filter(session_agent_id=agent_id).every_row("one agent of one test"))


def waiting_slice_on(story, session: str) -> None:
    story.expect_success(f"setting set {ACTIVE_SLICES_SETTING} '[\"{WAITING_SLICE}\"]'", actor=story.user)
    story.hook(session, HookSamples.session_start())


def test_a_message_to_an_agent_leaves_its_step_request_in_the_same_write_and_a_second_cause_joins_it(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    waiting_slice_on(story, helper.session)
    story.expect_success(f'message send "read the brief" --to agent:{helper.number}', actor=story.agent)
    story.expect_success(f'message send "and then the plan" --to agent:{helper.number}', actor=story.agent)
    opened = [request for request in requests(story, helper.id) if request.served_at is None]
    # one open request for the helper, which the messages joined: the helper's start may have asked for it first
    assert len(opened) == 1 and opened[0].causes[-1] == STEP_CAUSE and opened[0].causes.count(STEP_CAUSE) == 1


def test_the_round_serves_an_open_request(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    waiting_slice_on(story, helper.session)
    story.expect_success(f'message send "read the brief" --to agent:{helper.number}', actor=story.agent)
    AgentStepRound()(story.container)
    assert [request.served_at is not None for request in requests(story, helper.id)] == [True]
