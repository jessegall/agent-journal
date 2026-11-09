import re
from dataclasses import dataclass

from core.base.model.model import Model
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
        if not TAG_WORD.fullmatch(self.word):
            raise Refusal("a tag uses lower case letters, digits and hyphens", "use a single word")
