from core.base.driver.nudge import Nudge
from core.modules.messages.support.message_nudges import MESSAGE_ADVICE, REPLY_COMMAND, IMAGE_TAG_REQUEST
import re
from pathlib import PurePath

from core.base.agent_role import AgentRole
from core.base.journal_home import JournalHome
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.among import Among
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_captions import MessageCaptions

COMMAND_START = r"(?:^|-- '|&& |; )"
MESSAGE_READ_LINE = re.compile(COMMAND_START + r"journal message read (\d+)")
MESSAGE_UNREAD_LINE = re.compile(COMMAND_START + r"journal message unread\b")
IMAGE_SUFFIXES = (".png", ".jpg", ".jpeg", ".gif", ".webp")


class MessageReadRule(DriverRule):
    """A message the main agent has read with journal message read is marked read, the first time, and the
    agent is told how to act on it. The tool's line holds the command inside the runner's own line by then, so
    the rule looks for it in the text."""

    name = "messages.read-marks-read"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, home: JournalHome) -> None:
        self.queries, self.home = queries, home

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None:
            return RuleAnswer.allowed()
        numbers = tuple(int(number) for number in MESSAGE_READ_LINE.findall(shell.line))
        unread = list(self.queries.query(Message).matching(IsNull("read_at")).matching(Among("id", numbers)).all_rows()) if numbers else []
        if MESSAGE_UNREAD_LINE.search(shell.line):
            all_unread = self.queries.query(Message).filter(environment_id=hook.environment_id).matching(Among("type", PERSON_MESSAGE_TYPES)).matching(IsNull("read_at")).oldest().all_rows()
            unread = [message for message in all_unread if message.delivered_at is not None]
        images = [nudge for message in unread for nudge in self.image_nudges(message)]
        nudges = [MESSAGE_ADVICE.nudge(), REPLY_COMMAND.nudge(), *images] if unread else []
        return RuleAnswer.with_nudges(*nudges).running(*(ReadMessage(message.id) for message in unread))

    def image_nudges(self, message: Message) -> list[Nudge]:
        captions = MessageCaptions.decoded(message)
        return [IMAGE_TAG_REQUEST.nudge(message=message.id, name=name)
                for name in message.files if PurePath(name).suffix.lower() in IMAGE_SUFFIXES and name not in captions]
