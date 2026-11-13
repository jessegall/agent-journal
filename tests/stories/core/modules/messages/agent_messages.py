import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.messages.models.message import Message
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from core.modules.agents.support.report_nudges import PARENT_REPORT
from engine.testing.expectations.said_nudge import said

LINES = "agent-line list --agent {agent}"


def helper_actor(story) -> Actor:
    return Actor(helper_agent(story).id, ActorType.AGENT)


def sender_name(story, agent_id: int) -> Message:
    return story.container.get(Queries).query(Message).filter(session_agent_id=agent_id).newest().first()


def test_a_main_agent_messages_its_own_helper_and_the_helper_is_told_the_message(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_actor(story)
    story.expect_success(f'message send "Look at src/cart.py again" --to agent:{agent_number(story, helper.id)} --environment main', actor=story.agent)
    message = sender_name(story, story.agent.id)
    story.expect_text(LINES.format(agent=helper.id), said(PARENT_REPORT))
    story.expect_text(f"message read {message.id}", "Look at src/cart.py again", actor=helper)
    story.expect_rows(message.is_chat_visible is False)


def test_a_helper_messages_its_main_agent_by_the_number_agent_main_gives(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_actor(story)
    main = json.loads(story.run("agent main --environment main --json", actor=helper).output_text)
    story.expect_rows(main["number"] == agent_number(story, story.agent.id), main["id"] == story.agent.id, detail=str(main))
    story.expect_text("agent main --environment main", f"agent:{main['number']}, session", f"row id {story.agent.id}", actor=helper)
    story.expect_success(f'message send "The total is wrong" --to agent:{main["number"]} --environment main', actor=helper)
    message = sender_name(story, helper.id)
    story.expect_text(LINES.format(agent=story.agent.id), said(PARENT_REPORT))
    story.expect_text(f"message read {message.id}", "The total is wrong", actor=story.agent)


def test_a_stopped_receiver_is_woken_by_the_line(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_actor(story)
    story.expect_success(f'message send "Wake up" --to agent:{agent_number(story, helper.id)} --environment main', actor=story.agent)
    line = story.container.get(Queries).query(AgentLine).filter(session_agent_id=helper.id).newest().first()
    story.expect_rows(line is not None, line.wakes_agent)


def test_an_agent_messages_no_unrelated_agent_and_no_agent_that_does_not_exist(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_actor(story)
    sibling = Actor(story.new_row_id(f"agent start s-3 claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)
    story.expect_refusal(f'message send "Hello" --to agent:{agent_number(story, sibling.id)} --environment main', "not yours to message: message your main agent and the merger", actor=helper)
    story.expect_no_text(f'message send "Hello" --to agent:{agent_number(story, sibling.id)} --environment main', "message your own helpers", actor=helper)
    grandchild = Actor(story.new_row_id(f"agent start s-5 claude helper --parent {helper.id} --environment main"), ActorType.AGENT)
    story.expect_refusal(f'message send "Hello" --to agent:{agent_number(story, grandchild.id)} --environment main', "not yours to message: message your own helpers", actor=story.agent)
    story.expect_no_text(f'message send "Hello" --to agent:{agent_number(story, grandchild.id)} --environment main', "your main agent", actor=story.agent)
    story.expect_refusal('message send "Hello" --to agent:99 --environment main', "no agent", actor=story.agent)
    story.expect_refusal(f'message send "Hello" --to agent:{agent_number(story, story.agent.id)} --environment main', "sends no message to itself", actor=story.agent)
    story.expect_rows(sender_name(story, helper.id) is None)


def test_a_main_agents_reply_to_a_helper_names_that_helper_as_its_recipient(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_actor(story)
    story.expect_success(f'message send "The total is wrong" --to agent:{agent_number(story, story.agent.id)} --environment main', actor=helper)
    asked = sender_name(story, helper.id)
    story.expect_success(f'message reply {asked.id} "Fixing it"', actor=story.agent)
    reply = sender_name(story, story.agent.id)
    story.expect_rows(reply.parent_id == asked.id, reply.recipient == story.container.get(Queries).query(Agent).find(helper.id).display_name, detail=reply.recipient)


def test_a_main_agents_reply_to_a_person_names_no_recipient(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success('message send "Fix the cart" --environment main', actor=story.user)
    asked = story.container.get(Queries).query(Message).filter(creator_id=story.user.id).newest().first()
    story.expect_success(f'message reply {asked.id} "On it"', actor=story.agent)
    story.expect_rows(sender_name(story, story.agent.id).recipient == "")
