from engine.enums.actor_type import ActorType
from engine.event.created import Created
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.tasks.models.task_tag import TaskTag
from core.modules.tasks.models.task_tag_word import TaskTagWord
from core.modules.tasks.support.task_tag_confirmation import TaskTagConfirmation

TAG_TERMS_REASON = "the refusal lists every tag word in use, in the order of the words"


class TaskTagWordGuard(Guard[Created[TaskTag]]):
    """A new tag word needs an agent's confirmation."""

    name = "tasks.known-tag-word"
    short_flag = "confirm"
    is_confirmation = True

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Created[TaskTag], context: Context) -> None:
        word = event.row.word
        if isinstance(context.command, TaskTagConfirmation) and context.command.confirmed_tags:
            return
        if context.actor.type is ActorType.USER or self.queries.query(TaskTag).filter(word=word).exists():
            return
        listed_tags = ", ".join(row.word for row in self.queries.query(TaskTagWord).every_row(TAG_TERMS_REASON))
        raise Refusal(f"{word} is a new tag; in use: {listed_tags}", "use one of them, or repeat with --confirm")
