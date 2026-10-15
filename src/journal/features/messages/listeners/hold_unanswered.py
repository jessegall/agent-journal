import re

from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.tool_starting import ToolStarting
from journal.features.agent_listener import AgentListener
from journal.hooks.decision import Decision
from journal.repositories.entries import Entries
from journal.repositories.messages import Messages
from journal.repositories.settings import PROJECT, Settings

NUDGE_AFTER, HOLD_AFTER = "messages.nudge_after", "messages.hold_after"
"""The settings: tool uses with a message read and unanswered before the agent is nudged to answer, ten unless set, and before every tool call waits for the answer, fifteen unless set."""
DEFAULTS = {NUDGE_AFTER: 10, HOLD_AFTER: 15}
JOURNAL_COMMAND = re.compile(r"(?:^|[;&|]\s*)\S*journal\s+[a-z]")
"""A journal command anywhere in the shell line, after a cd or beside another command, as an agent writes it."""


class HoldUnanswered(AgentListener[ToolStarting]):
    """A message read and left unanswered is named back after ten tool uses, and after fifteen every tool call waits for the answer; only a journal command goes through. An answer is a reply, a face, or any message in the chat after the read."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, messages: Messages, entries: Entries, settings: Settings) -> None:
        self.machine, self.nudger, self.messages, self.entries, self.settings = machine, nudger, messages, entries, settings

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.messages.feature import Messages as MessagesFeature
        owed = self.messages.unanswered(event.environment_id)
        if not owed or self.is_journal_command(event):
            return None
        since = min(m.read_at for m in owed)
        uses = len([e for e in self.entries.of_kind(event.environment_id, "ToolStarting", 200) if e.actor and e.actor.id == event.session and e.created_at >= since])
        numbers = ", ".join(str(m.id) for m in owed[-3:])
        if uses >= self.after(HOLD_AFTER):
            return Decision.refuse(MessagesFeature.ANSWER_HELD.about(messages=numbers).rendered())
        if uses < self.after(NUDGE_AFTER):
            return None
        line = self.nudger.say(self.machine.agent(event.session, event.environment_id), MessagesFeature.ANSWER.about(messages=numbers))
        return Decision.tell(line) if line else None

    def after(self, setting: str) -> int:
        return int(self.settings.get(PROJECT, setting, DEFAULTS[setting]))

    @staticmethod
    def is_journal_command(event: ToolStarting) -> bool:
        return event.tool == "Bash" and bool(JOURNAL_COMMAND.search(event.input.get("command", "")))
