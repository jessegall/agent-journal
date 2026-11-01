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
from core.modules.messages.models.message import Message

MESSAGE_READ_LINE = re.compile(r"\bjournal message (read|show) (\d+)")
READ_COMMAND = "read"
IMAGE_SUFFIXES = (".png", ".jpg", ".jpeg", ".gif", ".webp")


class MessageShowReadRule(DriverRule):
    """A message the main agent has read with journal message read, or shown, is marked read, the first time; after
    journal message read the agent is told how to act on it. The tool's line holds the command inside the runner's
    own line by then, so the rule looks for it in the text."""

    name = "messages.shown-is-read"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, home: JournalHome) -> None:
        self.queries, self.home = queries, home

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        commands = {int(number): command for command, number in MESSAGE_READ_LINE.findall(shell.line)} if shell is not None else {}
        unread = tuple(self.queries.query(Message).matching(IsNull("read_at")).matching(Among("id", tuple(commands))).all_rows()) if commands else ()
        lines = [line for message in unread if commands[message.id] == READ_COMMAND for line in self.lines(message)]
        return RuleAnswer.with_lines(*lines).running(*(ReadMessage(message.id) for message in unread))

    def lines(self, message: Message) -> list[str]:
        images = [self.home.message_files(message.id) / name for name in message.files if PurePath(name).suffix.lower() in IMAGE_SUFFIXES]
        return [f"act on message {message.id}: if it steers your work, take it as steering and follow it from now on; if it asks for an update, give the update now;"
                " if it asks for work, make a task for it; otherwise answer it",
                *(f"message {message.id} attaches an image: open {image} and look at it before you act" for image in images)]
