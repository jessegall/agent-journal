from engine.agent_step.errors.step_conflict_error import StepConflictError
from engine.command.bus import Bus
from engine.log.error_log import ErrorLog
from core.modules.drivers.commands.run_agent_step.run_agent_step import RunAgentStep
from engine.query.queries import Queries
from core.modules.drivers.models.agent_step_request import AgentStepRequest
from core.modules.drivers.ticks.agent_step_round import AgentStepRound
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent

STEP_CAUSE = "messages.message-step"


def requests(story, agent_id: int) -> list[AgentStepRequest]:
    return list(story.container.get(Queries).query(AgentStepRequest).filter(session_agent_id=agent_id).every_row("one agent of one test"))


def waiting_slice_on(story, session: str) -> None:
    story.hook(session, HookSamples.session_start())


def test_a_message_to_an_agent_leaves_its_step_request_in_the_same_write_and_a_second_cause_joins_it(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    waiting_slice_on(story, helper.session)
    story.expect_success(f'message send "read the brief" --to agent:{helper.id}', actor=story.agent)
    story.expect_success(f'message send "and then the plan" --to agent:{helper.id}', actor=story.agent)
    opened = [request for request in requests(story, helper.id) if request.served_at is None]
    # one open request for the helper, which the messages joined: the helper's start may have asked for it first
    assert len(opened) == 1 and opened[0].causes[-1] == STEP_CAUSE and opened[0].causes.count(STEP_CAUSE) == 1


def test_the_round_serves_an_open_request(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    waiting_slice_on(story, helper.session)
    story.expect_success(f'message send "read the brief" --to agent:{helper.id}', actor=story.agent)
    AgentStepRound()(story.container)
    assert [request.served_at is not None for request in requests(story, helper.id)] == [True]


def test_a_step_whose_basis_moved_waits_for_the_next_round_and_logs_no_error(played, monkeypatch):
    story = played(StartedHelper)
    helper = helper_agent(story)
    waiting_slice_on(story, helper.session)
    story.expect_success(f'message send "read the brief" --to agent:{helper.id}', actor=story.agent)
    bus, errors = story.container.get(Bus), []
    run = bus.run

    def conflicting_run(command, *arguments, **keywords):
        if isinstance(command, RunAgentStep):
            raise StepConflictError()
        return run(command, *arguments, **keywords)

    monkeypatch.setattr(bus, "run", conflicting_run)
    monkeypatch.setattr(story.container.get(ErrorLog), "reported", lambda *arguments: errors.append(arguments))
    AgentStepRound()(story.container)
    assert errors == [] and [request.served_at for request in requests(story, helper.id)] == [None]
