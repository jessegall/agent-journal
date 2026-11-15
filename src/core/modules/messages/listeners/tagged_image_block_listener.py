from engine.command.bus import Bus
from engine.command.context import Context
from engine.event.updated import Updated
from engine.listener.save_listener import SaveListener
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.drivers.commands.close_agent_block.close_agent_block import CloseAgentBlock
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.nudges.required_command_refusal_message import RequiredCommandRefusalMessage
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_captions import MessageCaptions
from core.modules.messages.nudges.image_tag_request_message import ImageTagRequestMessage

IMAGE_TAG_BLOCKS_REASON = "every open block of the command is closed once its image is tagged"


class TaggedImageBlockListener(SaveListener[Updated[Message]]):
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
        command = ImageTagRequestMessage.declared().nudge(message=message.id, name="").required_command
        blocks = self.queries.query(AgentBlock).filter(nudge_key=f"{RequiredCommandRefusalMessage.declared().key}:{command}", condition_text=command).matching(IsNull("closed_at")).every_row(IMAGE_TAG_BLOCKS_REASON)
        for block in blocks:
            self.bus.dispatch(CloseAgentBlock(block.id), context)
