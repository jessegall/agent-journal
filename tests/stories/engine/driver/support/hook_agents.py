import re

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.driver.hook_reply import HookReply
from core.testing.story import Story


def hook_agent(story: Story, reply: HookReply) -> Actor:
    shown = story.run(f"hook-call show {reply.hook_call_id}").output_text
    agent_line = re.search(r"^agent_id: (\d+)$", shown, re.MULTILINE)
    assert agent_line is not None, f"hook call {reply.hook_call_id} names no agent: {shown}"
    return Actor(int(agent_line[1]), ActorType.AGENT)
