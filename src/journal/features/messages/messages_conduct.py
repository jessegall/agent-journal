import re

from journal.engine.base_state import BaseState
from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.stop import Stop
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.user_resumed import UserResumed
from journal.events.rows.reaction_added import ReactionAdded
from journal.support.chain import Chain

TRUNCATED = re.compile(r"(?:^|[;&|(]\s*)\S*journal\s+(?:message\s+(?:read|unread|recent)|question\s+(?:show|list))\b[^|;&\"']*\|")


class MessagesConduct(Conduct):
    """The messages feature's conduct in every state: the inbox named at a prompt and a stop and every so many of the agent's own tool uses, a write held once the unread were named often enough, the tools held while a read message stays unanswered past so many uses and an answer asked for before that, a read of the user's words piped into a filter held, the reply tag hinted after a message sent by command, and the user's face on a message told."""

    def on_prompt_submitted(self, event: PromptSubmitted, settings: Settings) -> Transition:
        return self.none(*inbox_line(event.data.part(messages_feature()).unread))

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        if self.blocks_tools():
            return self.none()
        messages = event.data.part(messages_feature())
        return self.none(*inbox_line(messages.unread), *[messages_feature().PEER_QUESTION.create(sender=q.sender, n=q.message) for q in messages.peer_questions])

    def on_user_resumed(self, event: UserResumed, settings: Settings) -> Transition:
        if event.agent_session != event.session:
            return self.none()
        return self.none(*inbox_line(event.data.part(messages_feature()).unread))

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return Transition.merged(self, [truncated_read_check(self, event, settings), unanswered_check(self, event, settings), unread_check(self, event, settings)])

    def on_reaction_added(self, event: ReactionAdded, settings: Settings) -> Transition:
        return self.none(messages_feature().USER_REACTION.create(face=event.face, n=event.message_id)) if event.user_origin else self.none()


def messages_feature():
    from journal.features.messages.feature import Messages
    return Messages


def inbox_line(unread: tuple[int, ...]) -> list[Nudge]:
    return [messages_feature().inbox(unread)] if unread else []


def file_reads(event: ToolStarting, folders: tuple[str, ...]) -> bool:
    return any(path.startswith(folder) for path in event.call.read_paths for folder in folders)


def truncated_read_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    return state.refuse(messages_feature().FULL_MESSAGE_READ.create()) if TRUNCATED.search(event.call.command) else state.none()


def unanswered_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    feature = messages_feature()
    messages = event.data.part(feature)
    if event.subagent or not messages.unanswered or event.call.is_journal or file_reads(event, messages.unanswered_files):
        return state.none()
    obligations = ", ".join(str(n) for n in messages.unanswered)
    if messages.uses_unanswered >= settings.integer(feature.TOOL_BLOCK_LIMIT):
        return state.refuse(feature.UNANSWERED_TOOL_BLOCK.create(messages=obligations))
    if messages.uses_unanswered >= settings.integer(feature.ANSWER_REQUEST_LIMIT):
        return state.none(feature.unanswered_countdown(messages.unanswered, settings.integer(feature.TOOL_BLOCK_LIMIT) - messages.uses_unanswered - 1))
    return state.none()


def unread_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    feature = messages_feature()
    messages = event.data.part(feature)
    if event.subagent or event.call.is_journal or not messages.unread:
        return state.none()
    limit = settings.integer(feature.EDIT_BLOCK_LIMIT)
    if event.call.writes and messages.inbox_tool_uses >= limit:
        return state.refuse(feature.INBOX_EDIT_BLOCK.create(count=len(messages.unread)))
    return state.none(feature.inbox_countdown(messages.unread, max(limit - messages.inbox_tool_uses - 1, 0)))
