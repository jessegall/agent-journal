from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.chat.queries.chat_mark_query import ChatMarkQuery
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.chat.models.enums.chat_mark_state import ChatMarkState

DETAIL_CHARACTERS = 80


class ShowMarkHandler(Handler[ShowMark, ChatMark]):
    """Makes the mark, or edits the shown mark of the same key in the environment, its variant too, and ends
    it when told to, and reads no row for a key made for this mark alone; the detail is cut to its first 80
    characters and the lines keep all of it, and a mark that ended is never edited."""

    command = ShowMark

    def __init__(self, marks: ChatMarkQuery, repository: Repository) -> None:
        self.marks, self.repository = marks, repository

    def handle(self, command: ShowMark, context: Context) -> ChatMark:
        existing = None if command.is_new_key else self.marks.keyed(command.key)
        detail = command.detail[:DETAIL_CHARACTERS]
        if existing is None:
            ended_at = context.timestamp if command.ended else None
            saved = self.repository.save(ChatMark(session_agent_id=command.agent_id, creator_id=context.actor.id, type=command.type.value,
                                                 variant=command.variant.value, key=command.key, text=command.text, detail=detail, lines=command.detail,
                                                 target_model=command.row_model, target_id=command.row_id, outcome=command.outcome, figure=command.figure,
                                                 fraction=command.fraction, state=ChatMarkState.ENDED if command.ended else ChatMarkState.SHOWN, ended_at=ended_at), context)
            self.marks.remember(saved)
            return saved
        if existing.state is ChatMarkState.ENDED:
            raise Refusal(f"chat mark {command.key} has ended", "show a mark under a new key")
        edited = existing.changed(session_agent_id=command.agent_id or existing.session_agent_id, variant=command.variant.value, text=command.text, detail=detail, lines=command.detail, target_model=command.row_model, target_id=command.row_id,
                                  outcome=command.outcome, figure=command.figure, fraction=command.fraction)
        saved = self.repository.save_change(existing, edited.end(context.timestamp, context.actor) if command.ended else edited, context)
        self.marks.remember(saved)
        return saved
