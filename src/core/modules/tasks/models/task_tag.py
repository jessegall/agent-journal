import re
from dataclasses import dataclass

from engine.model.model import Model
from engine.errors.refusal import Refusal

TAG_WORD = re.compile(r"[a-z0-9-]+")


@dataclass(frozen=True, kw_only=True)
class TaskTag(Model):
    """One subject word attached to a task."""

    model_name = "task_tag"
    cli_name = "task-tag"
    search_fields = ["word"]

    task_id: int
    creator_id: int
    word: str

    def __post_init__(self) -> None:
        TaskTag.require_word(self.word)

    @staticmethod
    def require_word(word: str) -> None:
        """Refuses a word that is not one lower-case tag word."""
        if not TAG_WORD.fullmatch(word):
            raise Refusal("a tag uses lower case letters, digits and hyphens", "use a single word")
