import re

from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.stop import Stop
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.user_resumed import UserResumed
from journal.events.rows.reaction_added import ReactionAdded
from journal.support.chain import Chain

TRUNCATED = re.compile(r"(?:^|[;&|(]\s*)\S*journal\s+(?:message\s+(?:read|unread|recent)|question\s+(?:show|list))\b[^|;&\"']*\|")
MESSAGE_COMMAND = "journal message send"


class MessagesConduct(Conduct):
    """The messages feature's conduct in every state: the inbox named at a prompt and a stop and every so many of the agent's own tool uses, a write held once the unread were named often enough, the tools held while a read message stays unanswered past so many uses and an answer asked for before that, a read of the user's words piped into a filter held, the reply tag hinted after a message sent by command, and the user's face on a message told."""

    def on_prompt_submitted_messages(self, event: PromptSubmitted, settings: Settings) -> Transition:
        return self.none(*inbox_named(event.data.part(messages_feature()).unread))

    def on_stop_messages(self, event: Stop, settings: Settings) -> Transition:
        if self.blocks_tools():
            return self.none()
        return self.none(*inbox_named(event.data.part(messages_feature()).unread))

    def on_user_resumed_messages(self, event: UserResumed, settings: Settings) -> Transition:
        if event.agent_session != event.session:
            return self.none()
        return self.none(*inbox_named(event.data.part(messages_feature()).unread))

    def on_tool_starting_messages_read_whole(self, event: ToolStarting, settings: Settings) -> Transition:
        return self.refuse(messages_feature().FULL_MESSAGE_READ.create()) if TRUNCATED.search(event.call.command) else self.none()

    def on_tool_starting_messages_unanswered(self, event: ToolStarting, settings: Settings) -> Transition:
        feature = messages_feature()
        messages = event.data.part(feature)
        if event.subagent or not messages.unanswered or event.call.is_journal or reads_their_files(event, messages.unanswered_files):
            return self.none()
        owed = ", ".join(str(n) for n in messages.unanswered)
        if messages.uses_unanswered >= int(settings.value(feature.TOOL_BLOCK_LIMIT)):
            return self.refuse(feature.UNANSWERED_TOOL_BLOCK.create(messages=owed))
        if messages.uses_unanswered >= int(settings.value(feature.ANSWER_REQUEST_LIMIT)):
            return self.none(feature.UNANSWERED_MESSAGES.create(messages=owed))
        return self.none()

    def on_tool_starting_messages_unread(self, event: ToolStarting, settings: Settings) -> Transition:
        feature = messages_feature()
        messages = event.data.part(feature)
        if event.subagent or event.call.is_journal or not messages.unread:
            return self.none()
        if event.call.writes and messages.times_named >= int(settings.value(feature.EDIT_BLOCK_LIMIT)):
            return self.refuse(feature.INBOX_EDIT_BLOCK.create(count=len(messages.unread)))
        every = int(settings.value(feature.REMINDER_INTERVAL))
        if every > 0 and messages.uses_since_newest > 0 and messages.uses_since_newest % every == 0:
            return self.none(feature.inbox(messages.unread))
        return self.none()

    def on_tool_finished_messages(self, event: ToolFinished, settings: Settings) -> Transition:
        command = event.call.command
        return self.none(messages_feature().TAG_REPLY.create()) if MESSAGE_COMMAND in command else self.none()

    def on_reaction_added_messages(self, event: ReactionAdded, settings: Settings) -> Transition:
        return self.none(messages_feature().USER_REACTION.create(face=event.face, n=event.message_id)) if event.by_user else self.none()


def messages_feature():
    from journal.features.messages.feature import Messages
    return Messages


def inbox_named(unread: tuple[int, ...]) -> list[Nudge]:
    return [messages_feature().inbox(unread)] if unread else []


def reads_their_files(event: ToolStarting, folders: tuple[str, ...]) -> bool:
    return any(path.startswith(folder) for path in event.call.read_paths for folder in folders)
