import re

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.hook_reply import HookReply
from core.testing.story import Story


def hook_agent(story: Story, reply: HookReply) -> Actor:
    shown = story.run(f"hook-call show {reply.hook_call_id}").output_text
    found = re.search(r"^agent_id: (\d+)$", shown, re.MULTILINE)
    assert found is not None, f"hook call {reply.hook_call_id} names no agent: {shown}"
    return Actor(int(found[1]), ActorType.AGENT)
