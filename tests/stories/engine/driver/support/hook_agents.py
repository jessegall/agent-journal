from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.driver.hook_reply import HookReply
from engine.testing.stories.story import Story
from core.modules.drivers.models.hook_call import HookCall


def hook_agent(story: Story, reply: HookReply) -> Actor:
    return Actor(story.row(HookCall, reply.hook_call_id).session_agent_id, ActorType.AGENT)
