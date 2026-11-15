from engine.actor.actor import Actor
from engine.command.context import Context
from engine.database.database import Database
from engine.enums.escalation_type import EscalationType
from engine.enums.responder import Responder
from engine.repository.repository import Repository
from core.modules.drivers.commands.deliver_agent_wake.deliver_agent_wake import DeliverAgentWake
from core.modules.drivers.models.agent_escalation import AgentEscalation
from tests.stories.core.modules.chat.support.mark_samples import expect_marks_text
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_an_opened_escalation_is_shown_once_in_the_chat(played):
    story = played(BuilderStarted)
    escalation = AgentEscalation(session_agent_id=story.agent.id, environment_id=1, escalation_type=EscalationType.STOPS, responder=Responder.PERSON, refusal_count=5)
    with story.container.get(Database).transaction():
        story.container.get(Repository).save(escalation, Context(Actor.core(), story.clock.timestamp(), DeliverAgentWake(0)))
    story.run_listeners()
    expect_marks_text(story, "Asked the person for help after 5 refused stops in a row")
