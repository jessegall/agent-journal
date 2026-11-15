from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.query.conditions.among import Among
from engine.request.request_values import RequestValues
from core.modules.messages.models.message import Message
from core.modules.messages.nudges.image_tag_request_message import ImageTagRequestMessage
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.message_captions import MessageCaptions

UNREAD_REASON = "reading the unread list marks every delivered unread message as read"


class MessageReads:
    """The messages addressed to the agent that the journal line it just ran read, not yet noted as read: read once
    a hook, so the lines that explain how to answer and the effect that notes them read agree."""

    def __init__(self, messages: MessageQuery, request_values: RequestValues) -> None:
        self.messages, self.request_values = messages, request_values

    def unread(self, event: HookEvent, agent_id: int) -> list[Message]:
        # read once a hook whatever changes meanwhile: noting a message read takes it off this list
        return self.request_values.read(f"messages.read:{agent_id}:{event.firing}", lambda: event.firing, lambda: self.found(event, agent_id))

    def found(self, event: HookEvent, agent_id: int) -> list[Message]:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None:
            return []
        numbers = shell.journal_command_numbers("message read")
        unread = self.messages.addressed(agent_id).matching(Among("id", numbers)).get() if numbers else []
        unread = [message for message in unread if message.read_notice_at is None]
        if shell.parts_running_journal_command("message unread"):
            unread = [message for message in self.messages.unread(agent_id).every_row(UNREAD_REASON) if message.delivered_at is not None]
        return unread

    @staticmethod
    def image_nudges(message: Message) -> list[AgentMessage]:
        return [ImageTagRequestMessage.declared().nudge(message=message.id, name=name) for name in MessageCaptions.untagged_images(message)]
