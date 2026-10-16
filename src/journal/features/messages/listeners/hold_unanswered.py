from journal.config import Config
from journal.engine.machine import Machine
from journal.features.shell.chain import Chain
from journal.engine.nudger import Nudger
from journal.events.agent.tool_starting import ToolStarting
from journal.features.agent_listener import AgentListener
from journal.features.option import Option
from journal.hooks.decision import Decision
from journal.providers.providers import Providers
from journal.repositories.entries import Entries
from journal.repositories.messages import Messages
from journal.repositories.settings import PROJECT, Settings



class HoldUnanswered(AgentListener[ToolStarting]):
    """A message read and left unanswered is named back after ten tool uses, and after fifteen every tool call waits for the answer; only a journal command goes through. An answer is a reply, a face, or any message in the chat after the read."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, messages: Messages, entries: Entries, settings: Settings, config: Config, providers: Providers) -> None:
        self.machine, self.nudger, self.messages, self.entries, self.settings, self.config = machine, nudger, messages, entries, settings, config
        self.providers = providers

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.messages.feature import Messages as MessagesFeature
        owed = self.messages.unanswered(event.environment_id)
        if not owed or self.is_journal_command(event) or self.reads_their_files(event, owed):
            return None
        since = min(m.read_at for m in owed)
        uses = len([e for e in self.entries.of_kind(event.environment_id, "ToolStarting", 200) if e.actor and e.actor.id == event.session and e.created_at >= since])
        numbers = ", ".join(str(m.id) for m in owed[-3:])
        if uses >= self.after(MessagesFeature.HOLD_AFTER):
            return Decision.refuse(MessagesFeature.ANSWER_HELD.about(messages=numbers).rendered())
        if uses < self.after(MessagesFeature.NUDGE_AFTER):
            return None
        line = self.nudger.say(self.machine.agent(event.session, event.environment_id), MessagesFeature.ANSWER.about(messages=numbers))
        return Decision.tell(line) if line else None

    def after(self, option: Option) -> int:
        return int(self.settings.option(PROJECT, option))

    def reads_their_files(self, event: ToolStarting, owed: list) -> bool:
        """A look at a file attached to the message being answered is part of reading it, not work."""
        path = self.providers.named(event.provider or "claude").read_path(event.tool, event.input)
        return bool(path) and any(path.startswith(str(self.config.home / "files" / "message" / str(m.id)) + "/") for m in owed)

    def is_journal_command(self, event: ToolStarting) -> bool:
        shell = self.providers.named(event.provider or "claude").shell_tool
        journal, parts = Chain.journal_parts(event.input.get("command", "")) if event.tool == shell else (0, 0)
        return parts > 0 and journal == parts
