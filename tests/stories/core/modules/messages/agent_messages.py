from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.messages.models.message import Message
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent

LINES = "agent-line list --agent {agent}"


def helper_actor(story) -> Actor:
    return Actor(helper_agent(story).id, ActorType.AGENT)


def sent_by(story, agent_id: int) -> Message:
    return story.container.get(Queries).query(Message).filter(session_agent_id=agent_id).newest().first()


def test_a_main_agent_messages_its_own_helper_and_the_helper_is_told_the_message(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_actor(story)
    story.expect_success(f'message send "Look at src/cart.py again" --to agent:{helper.id}', actor=story.agent)
    message = sent_by(story, story.agent.id)
    story.expect_text(LINES.format(agent=helper.id), f"agent:{story.agent.id} reports in message:{message.id}")
    story.expect_text(f"message read {message.id}", "Look at src/cart.py again", actor=helper)
    story.expect_rows(message.is_chat_visible is False)


def test_a_helper_messages_its_main_agent(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_actor(story)
    story.expect_success(f'message send "The total is wrong" --to agent:{story.agent.id}', actor=helper)
    message = sent_by(story, helper.id)
    story.expect_text(LINES.format(agent=story.agent.id), f"agent:{helper.id} reports in message:{message.id}")
    story.expect_text(f"message read {message.id}", "The total is wrong", actor=story.agent)


def test_a_stopped_receiver_is_woken_by_the_line(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_actor(story)
    story.expect_success(f'message send "Wake up" --to agent:{helper.id}', actor=story.agent)
    line = story.container.get(Queries).query(AgentLine).filter(session_agent_id=helper.id).newest().first()
    story.expect_rows(line is not None, line.wakes_agent)


def test_an_agent_messages_no_unrelated_agent_and_none_of_another_environment(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_actor(story)
    sibling = Actor(story.new_row_id(f"agent start s-3 claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)
    story.expect_refusal(f'message send "Hello" --to agent:{sibling.id}', "not yours to message", actor=helper)
    story.expect_success("environment make elsewhere /work/elsewhere", actor=story.user)
    elsewhere = Actor(story.new_row_id("agent start s-4 claude main --environment elsewhere"), ActorType.AGENT)
    story.expect_refusal(f'message send "Hello" --to agent:{elsewhere.id}', "no agent", actor=story.agent)
    story.expect_refusal(f'message send "Hello" --to agent:{story.agent.id}', "sends no message to itself", actor=story.agent)
    story.expect_rows(sent_by(story, helper.id) is None)
