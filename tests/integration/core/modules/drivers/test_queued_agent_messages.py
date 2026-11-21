from datetime import timedelta

from engine.actor.actor import Actor
from engine.command.context import Context
from engine.database.database import Database
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType
from engine.driver.message_sender import MessageSender
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder

QUEUED = MessageTemplate("sample.queued", AgentMessageType.NOTICE, "task {task} is queued for worker {worker}",
                          plural_text="tasks {task} are queued for worker {worker}", id_field="task")


def test_queued_declarations_merge_before_the_tool_hook_line_limit(played):
    story = played(StartedTaskBuilder)
    message_sender = story.container.get(MessageSender)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        for task in range(1, 5):
            message_sender.send(story.agent.id, QUEUED, "sample.queued", context, task=task, worker=7)
    answer = story.hook("s-1", HookSamples.edit("cart.py"))
    expect_queued_lines(answer, ["tasks 1, 2, 3, 4 are queued for worker 7"])
    expect_queued_lines(story.hook("s-1", HookSamples.edit("cart.py")), [])


def expect_queued_lines(answer, expected):
    assert [line for line in answer.lines if "queued for worker" in line] == expected, answer


def test_a_sent_text_reaches_the_agent_whole_on_its_next_hook(played):
    story = played(StartedTaskBuilder)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        story.container.get(MessageSender).send_text(story.agent.id, "Test only at the end of each phase", "sample.raw", context)
    assert "Test only at the end of each phase" in story.hook("s-1", HookSamples.prompt("Continue")).lines


def test_a_line_typed_while_the_agent_works_comes_with_its_next_hook_and_a_typed_prompt_takes_it_once(played):
    story = played(StartedTaskBuilder)
    story.hook("s-1", HookSamples.prompt("Fix the cart"))
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        busy = story.container.get(MessageSender).send_text(story.agent.id, "merger-line:7 waits for you", "sample.raw", context, wakes_agent=True)
    story.advance(timedelta(seconds=1))
    story.run_command(EnterAgentLine(busy.id), Actor.core())
    assert "merger-line:7 waits for you" in story.hook("s-1", HookSamples.edit("cart.py")).lines
    with story.container.get(Database).transaction():
        idle = story.container.get(MessageSender).send_text(story.agent.id, "merger-line:8 waits for you", "sample.raw", context, wakes_agent=True)
    story.advance(timedelta(seconds=1))
    story.run_command(EnterAgentLine(idle.id), Actor.core())
    assert "merger-line:8 waits for you" not in story.hook("s-1", HookSamples.prompt("[journal] merger-line:8 waits for you")).lines
    assert "merger-line:8 waits for you" not in story.hook("s-1", HookSamples.edit("cart.py")).lines
