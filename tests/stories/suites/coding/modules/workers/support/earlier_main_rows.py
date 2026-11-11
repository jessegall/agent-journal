from engine.actor.actor import Actor
from engine.command.context import Context
from engine.database.database import Database
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.repository.repository import Repository
from engine.testing.stories.story import Story
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.messages.commands.read_message.read_message import ReadMessage

EARLIER_MAIN_SESSION = "s-earlier-main"
EARLIER_MAIN_NUMBER = 90


def put_under_earlier_main_row(story: Story, worker_id: int) -> int:
    """Puts a worker under an ended main row that is not the main agent's own row. A journal made before a
    main session reused the main agent's row has such rows, and no command makes one any more, so the rows
    are saved directly."""
    repository = story.container.get(Repository)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1), environment_id=1)
    with story.container.get(Database).transaction():
        actor = repository.save(ActorRecord(type=ActorType.AGENT, name=EARLIER_MAIN_SESSION, creator_id=story.user.id), context)
        earlier = repository.save(Agent(id=actor.id, environment_id=1, number=EARLIER_MAIN_NUMBER, creator_id=story.user.id, session=EARLIER_MAIN_SESSION,
                                        program="claude", role=AgentRole.MAIN, ended_at=story.clock.timestamp()), context)
        repository.save(story.row(Agent, worker_id).changed(parent_id=earlier.id), context)
    return earlier.id
