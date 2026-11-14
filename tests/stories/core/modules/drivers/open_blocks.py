from engine.actor.actor import Actor
from engine.command.context import Context
from core.modules.messages.commands.read_message.read_message import ReadMessage
from engine.driver.states.open_blocks import OpenBlocks
from engine.repository.repository import Repository
from core.modules.drivers.models.agent_block import AgentBlock
from tests.stories.core.support.fixtures import UserJoined


def core_context(story) -> Context:
    return Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))


def saved_block(story, nudge_key: str) -> AgentBlock:
    block = AgentBlock(session_agent_id=story.agent.id, creator_id=story.agent.id, nudge_key=nudge_key, nudge_text="held", condition_name="c", condition_text="t")
    return story.container.get(Repository).save(block, core_context(story))


def test_an_agents_open_block_for_a_named_nudge_is_an_open_row_and_a_closed_or_other_one_is_not(new_story):
    story = new_story(fixture=UserJoined)
    open_block, other_block, closed_block = saved_block(story, "stories.held"), saved_block(story, "stories.other"), saved_block(story, "stories.held")
    story.container.get(Repository).update(closed_block, core_context(story), closed_at=story.clock.timestamp())
    rows = story.container.get(OpenBlocks).open_rows(story.agent.id, ["stories.held"])
    story.expect_rows([row.ref for row in rows] == [f"agent_block:{open_block.id}"], detail=str(rows) + str(other_block.id))
