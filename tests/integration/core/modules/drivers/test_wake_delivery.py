from datetime import timedelta

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.database.database import Database
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.testing.examples.hook_samples import HookSamples
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.claim_agent_wake.claim_agent_wake import ClaimAgentWake
from core.modules.drivers.commands.claim_agent_wake.claim_agent_wake_handler import WAKE_SOURCE
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.agent_wake import AgentWake
from core.modules.drivers.models.enums.wake_state import WakeState
from core.modules.drivers.ticks.agent_wake_delivery import AgentWakeDelivery
from core.modules.drivers.support.waiting_line_typing import WaitingLineTyping
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from tests.stories.core.support.coding_fixtures import BuilderStarted


def stored_wake(story, agent_id: int, **fields: object) -> AgentWake:
    wake = AgentWake(session_agent_id=agent_id, environment_id=1, work_number="task:1", session_number=1, causes='["tasks.work-remains"]', **fields)
    with story.container.get(Database).transaction():
        return story.container.get(Repository).save(wake, Context(Actor.core(), story.clock.timestamp(), ClaimAgentWake(0)))


def wake_row(story, wake_id: int) -> AgentWake:
    return story.container.get(Queries).query(AgentWake).all_environments("one test's wake").find(wake_id)


def wake_lines(story, agent_id: int) -> list[AgentLine]:
    return list(story.container.get(Queries).query(AgentLine).filter(session_agent_id=agent_id, source=WAKE_SOURCE).every_row("one agent of one test"))


def test_an_open_wake_left_by_a_server_that_stopped_is_delivered_by_the_next_round_and_a_hook_acknowledges_it(played):
    story = played(BuilderStarted)
    wake = stored_wake(story, story.agent.id)
    AgentWakeDelivery()(story.container)
    delivered = wake_row(story, wake.id)
    assert (delivered.state, delivered.attempts, delivered.transport) == (WakeState.DELIVERED, 1, "typing") and wake_lines(story, story.agent.id)
    story.advance(timedelta(seconds=1))
    story.hook("s-1", HookSamples.stop())
    assert wake_row(story, wake.id).state is WakeState.ACKNOWLEDGED


def test_a_wake_tried_as_often_as_allowed_expires_and_its_parent_is_told_once(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    wake = stored_wake(story, helper.id, attempts=3)
    AgentWakeDelivery()(story.container)
    AgentWakeDelivery()(story.container)
    given = [line for line in wake_lines(story, helper.parent_id) if "took no turn" in line.text]
    assert wake_row(story, wake.id).state is WakeState.EXPIRED and len(given) == 1


def test_a_retired_agents_wake_is_cancelled(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    wake = stored_wake(story, helper.id)
    story.expect_success(f"helper stop {helper.number}", actor=story.agent)
    story.expect_success(f'agent retire {helper.number} --reason "done"', actor=story.user)
    assert story.container.get(AgentRows).find(helper.id).retired_at is not None
    AgentWakeDelivery()(story.container)
    assert wake_row(story, wake.id).state is WakeState.CANCELLED


def test_a_wake_is_claimed_with_a_lease_in_its_own_write(played):
    story = played(BuilderStarted)
    wake = stored_wake(story, story.agent.id)
    claimed = story.container.get(Bus).run(ClaimAgentWake(wake.id), Actor.core(), environment_id=1)
    assert (claimed.state, claimed.lease_ends_at is not None, wake_row(story, wake.id).state) == (WakeState.CLAIMED, True, WakeState.CLAIMED)


def test_a_claimed_wake_whose_typing_fails_is_put_back_to_open_with_why(played, monkeypatch):
    story = played(BuilderStarted)
    wake = stored_wake(story, story.agent.id)

    def failed(self, agent_id: int, actor_id: int) -> None:
        raise OSError("the terminal took no input")

    monkeypatch.setattr(WaitingLineTyping, "release_waiting_lines", failed)
    AgentWakeDelivery()(story.container)
    row = wake_row(story, wake.id)
    assert (row.state, row.failure, row.lease_ends_at) == (WakeState.OPEN, "the terminal took no input", None)
