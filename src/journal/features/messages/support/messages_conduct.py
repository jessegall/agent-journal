import re

from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.idle import Idle
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.reaction_given import ReactionGiven
from journal.support.chain import Chain

TRUNCATED = re.compile(r"(?:^|[;&|(]\s*)\S*journal\s+(?:message\s+(?:read|unread|recent)|question\s+(?:show|list))\b[^|;&\"']*\|")
"""A read of the user's words, a message or a question, as a command and not as words quoted inside another, piped into anything: head, tail, grep, cut. The whole of it is the point."""
SENT = "journal message send"


class MessagesConduct(Conduct):
    """The messages feature's conduct in every state: the inbox named at a prompt and a stop and every so many of the agent's own tool uses, a write held once the unread were named often enough, the tools held while a read message stays unanswered past so many uses and an answer asked for before that, a read of the user's words piped into a filter held, the reply tag hinted after a message sent by command, and the user's face on a message told."""

    def on_prompt_submitted_messages(self, event: PromptSubmitted, settings: Settings) -> Transition:
        return self.unchanged(*inbox_named(event.standing.of(messages_feature()).unread))

    def on_idle_messages(self, event: Idle, settings: Settings) -> Transition:
        return self.unchanged(*inbox_named(event.standing.of(messages_feature()).unread))

    def on_tool_starting_messages_read_whole(self, event: ToolStarting, settings: Settings) -> Transition:
        return self.hold(messages_feature().READ_THE_WORDS_WHOLE.create()) if TRUNCATED.search(event.words) else self.unchanged()

    def on_tool_starting_messages_unanswered(self, event: ToolStarting, settings: Settings) -> Transition:
        feature = messages_feature()
        messages = event.standing.of(feature)
        if event.subagent or not messages.unanswered or Chain.is_journal_line(event.words) or reads_their_files(event, messages.unanswered_files):
            return self.unchanged()
        owed = ", ".join(str(n) for n in messages.unanswered)
        if messages.uses_unanswered >= int(settings.of(feature.HOLD_AFTER)):
            return self.hold(feature.TOOLS_HELD_UNTIL_ANSWERED.create(messages=owed))
        if messages.uses_unanswered >= int(settings.of(feature.NUDGE_AFTER)):
            return self.unchanged(feature.ANSWER_BEFORE_ANYTHING_ELSE.create(messages=owed))
        return self.unchanged()

    def on_tool_starting_messages_unread(self, event: ToolStarting, settings: Settings) -> Transition:
        feature = messages_feature()
        messages = event.standing.of(feature)
        if event.subagent or not messages.unread:
            return self.unchanged()
        if event.writes and messages.times_named >= int(settings.of(feature.HOLD_AFTER_REMINDERS)):
            return self.hold(feature.WRITE_HELD_UNTIL_READ.create(count=len(messages.unread)))
        every = int(settings.of(feature.REMIND_EVERY))
        if every > 0 and messages.uses_since_newest > 0 and messages.uses_since_newest % every == 0:
            return self.unchanged(feature.inbox(messages.unread))
        return self.unchanged()

    def on_tool_finished_messages(self, event: ToolFinished, settings: Settings) -> Transition:
        command = event.input.get("command", "") if event.tool == "Bash" else ""
        return self.unchanged(messages_feature().REPLY_BY_TAG.create()) if SENT in command else self.unchanged()

    def on_reaction_given_messages(self, event: ReactionGiven, settings: Settings) -> Transition:
        return self.unchanged(messages_feature().THE_USER_REACTED.create(face=event.face, n=event.message_id)) if event.by_user else self.unchanged()


def messages_feature():
    from journal.features.messages.feature import Messages
    return Messages


def inbox_named(unread: tuple[int, ...]) -> list[Nudge]:
    return [messages_feature().inbox(unread)] if unread else []


def reads_their_files(event: ToolStarting, folders: tuple[str, ...]) -> bool:
    return any(path.startswith(folder) for path in event.read_paths for folder in folders)
