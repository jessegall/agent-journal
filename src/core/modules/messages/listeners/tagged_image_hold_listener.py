from engine.command.bus import Bus
from engine.command.context import Context
from engine.event.updated import Updated
from engine.listener.save_listener import SaveListener
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.drivers.commands.close_agent_block.close_agent_block import CloseAgentBlock
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.support.driver_nudges import REQUIRED_COMMAND_REFUSAL
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_captions import MessageCaptions
from core.modules.messages.support.message_nudges import IMAGE_TAG_REQUEST


class TaggedImageHoldListener(SaveListener[Updated[Message]]):
    """Ends the hold that asks for a message's pictures to be tagged once every picture has a caption, however the
    caption was written, so a tag that the hold did not see as its command still ends it."""

    name = "messages.tagged-image-hold"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def handle(self, event: Updated[Message], context: Context) -> None:
        message = event.row
        if message.captions == event.previous.captions or MessageCaptions.untagged_images(message):
            return
        command = IMAGE_TAG_REQUEST.nudge(message=message.id, name="").required_command
        blocks = self.queries.query(AgentBlock).filter(nudge_key=f"{REQUIRED_COMMAND_REFUSAL.key}:{command}", condition_text=command).matching(IsNull("closed_at")).all_rows()
        for block in blocks:
            self.bus.dispatch(CloseAgentBlock(block.id), context)
