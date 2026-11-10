from engine.driver.nudge import Nudge
from core.modules.messages.support.message_nudges import MESSAGE_NOTE, REPLY_COMMAND, IMAGE_TAG_REQUEST
from pathlib import PurePath

from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.query.conditions.among import Among
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.commands.read_message.note_message_read import NoteMessageRead
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_captions import MessageCaptions

IMAGE_SUFFIXES = (".png", ".jpg", ".jpeg", ".gif", ".webp")


class MessageReadRule(DriverRule):
    """Marks messages read by their target agent and explains how to answer them."""

    name = "messages.read-marks-read"
    overlay_proof = True
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, messages: MessageQuery) -> None:
        self.messages = messages

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None:
            return RuleAnswer.allowed()
        numbers = shell.journal_command_numbers("message read")
        unread = list(self.messages.addressed(hook.agent_id).matching(Among("id", numbers)).all_rows()) if numbers else []
        unread = [message for message in unread if message.read_notice_at is None]
        if shell.parts_running_journal_command("message unread"):
            all_unread = self.messages.unread(hook.agent_id).oldest().all_rows()
            unread = [message for message in all_unread if message.delivered_at is not None]
        images = [nudge for message in unread for nudge in self.image_nudges(message)]
        nudges = [MESSAGE_NOTE.nudge(), REPLY_COMMAND.nudge(), *images] if unread else []
        return RuleAnswer.with_nudges(*nudges).running(*(NoteMessageRead(message.id) for message in unread))

    def image_nudges(self, message: Message) -> list[Nudge]:
        captions = MessageCaptions.decoded(message)
        return [IMAGE_TAG_REQUEST.nudge(message=message.id, name=name)
                for name in message.files if PurePath(name).suffix.lower() in IMAGE_SUFFIXES and name not in captions]
