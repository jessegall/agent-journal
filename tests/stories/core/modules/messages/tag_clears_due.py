from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.enums.command_category import CommandCategory
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.driver_nudges import REQUIRED_COMMAND_TOOL_USES
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.memories.commands.open_memory_mark.open_memory_mark import OpenMemoryMark
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_captions import MessageCaptions
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import UserBuilder


def start_story_with_image_block(new_story):
    story = new_story(fixture=UserBuilder)
    bus = story.container.get(Bus)
    pending = story.home.pending_files / "0123456789abcdef"
    pending.mkdir(parents=True)
    (pending / "cart.png").write_bytes(b"image")
    environment = story.row(Agent, story.agent.id).environment_id
    message = bus.run(SendMessage("Look at the cart", files=tuple(["0123456789abcdef/cart.png"])), story.user, environment_id=environment)
    read = f"journal message read {message.id}"
    story.expect_hook_allowed("s-1", HookSamples.shell(read, ShellPart("journal", CommandCategory.JOURNAL, ["message", "read", str(message.id)])).with_fields(event="post_tool_use"), "has an image")
    bus.run(OpenMemoryMark(story.agent.id, 50), Actor.core())
    for _ in range(REQUIRED_COMMAND_TOOL_USES + 1):
        story.expect_hook_allowed("s-1", HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"])))
    return story, message


def expect_tag_clears(story, message, line, *parts):
    story.expect_hook_allowed("s-1", HookSamples.shell(line, *parts))
    story.expect_success(f'message tag {message.id} "cart.png" "The cart total is wrong"', actor=story.agent)
    story.expect_rows(MessageCaptions.decoded(story.row(Message, message.id))["cart.png"] == "The cart total is wrong")
    story.expect_success('memory skip "Nothing to keep"', actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))
    story.expect_rows(not story.container.get(Queries).query(AgentBlock).filter(session_agent_id=story.agent.id, condition_text=f"journal message tag {message.id}").matching(IsNull("closed_at")).exists())


def test_a_tag_in_a_shell_chain_during_memory_weighing_clears_its_due_mark(new_story):
    story, message = start_story_with_image_block(new_story)
    line = f'cat notes && journal message tag {message.id} "cart.png" "The cart total is wrong"'
    expect_tag_clears(story, message, line, ShellPart("cat", CommandCategory.READ, ["notes"]), ShellPart("journal", CommandCategory.JOURNAL, ["message", "tag", str(message.id), "cart.png", "The cart total is wrong"]))
