from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.chat.commands.show_mark import ShowMark
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.chat.models.enums.chat_mark_state import ChatMarkState

DETAIL_CHARACTERS = 80


class ShowMarkHandler(Handler[ShowMark, ChatMark]):
    """Makes the mark, or edits the shown mark of the same key in the environment and ends it when told to; the
    detail is cut to its first 80 characters and the lines keep all of it, and a mark that ended is never edited."""

    command = ShowMark

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ShowMark, context: Context) -> ChatMark:
        existing = next(self.queries.query(ChatMark).filter(environment_id=command.environment_id, key=command.key).all_rows(), None)
        detail = command.detail[:DETAIL_CHARACTERS]
        if existing is None:
            ended_at = context.timestamp if command.ended else None
            return self.repository.save(ChatMark(environment_id=command.environment_id, agent_id=command.agent_id, creator_id=context.actor.id, type=command.type.value,
                                                 variant=command.variant.value, key=command.key, text=command.text, detail=detail, lines=command.detail,
                                                 target_model=command.row_model, target_id=command.row_id, outcome=command.outcome, figure=command.figure,
                                                 fraction=command.fraction, state=ChatMarkState.ENDED if command.ended else ChatMarkState.SHOWN, ended_at=ended_at), context)
        if existing.state is ChatMarkState.ENDED:
            raise Refusal(f"chat mark {command.key} has ended", "show a mark under a new key")
        edited = existing.changed(agent_id=command.agent_id, text=command.text, detail=detail, lines=command.detail, target_model=command.row_model, target_id=command.row_id,
                                  outcome=command.outcome, figure=command.figure, fraction=command.fraction)
        return self.repository.save(edited.end(context.timestamp, context.actor) if command.ended else edited, context)
