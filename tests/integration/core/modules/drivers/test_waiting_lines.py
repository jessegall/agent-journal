from engine.actor.actor import Actor
from engine.agent_machine.contracts.line_source import LineSource
from engine.agent_machine.record.line import Line
from engine.agent_machine.record.question import Question
from engine.agent_machine.stepping.agent_state_machine import AgentStateMachine
from engine.agent_step.agent_view_reader import AgentViewReader
from engine.agent_step.step_writer import StepWriter
from engine.command.context import Context
from engine.database.database import Database
from engine.enums.line_channel import LineChannel
from engine.enums.line_category import LineCategory
from engine.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.messages.commands.read_message.read_message import ReadMessage
from tests.stories.core.support.coding_fixtures import BuilderStarted

NOTICE = "a notice that waits for a hook that can carry it"


class WaitingNotice(LineSource):
    """A sample line a step gives outside a hook, which no hook carries now."""

    events = ()
    includes_steps = True
    carrier = LineChannel.WAITING

    def lines(self, question, view):
        return [Line("samples.waiting-notice", NOTICE, LineCategory.INFORMATION, "", self.carrier)]


def test_a_line_no_event_carries_now_waits_in_the_agents_line_queue(played):
    story = played(BuilderStarted)
    view = story.container.get(AgentViewReader).read(story.agent.id, Question.none())
    step = AgentStateMachine(lines=[WaitingNotice()]).step(view, Question.none())
    with story.container.get(Database).transaction():
        story.container.get(StepWriter).save(view, step, None, Context(Actor.core(), story.clock.timestamp(), ReadMessage(1)))
    waiting = story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id, state=AgentLineState.WAITING).every_row("one agent of one test")
    assert NOTICE in [line.text for line in waiting]
