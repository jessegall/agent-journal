from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.modules.tasks.models.support.views import TASK_TAG_COUNTS_SELECT


@dataclass(frozen=True, kw_only=True)
class TaskTagWord(ViewModel):
    """A tag word and the number of tasks using it across the project."""

    cli_name = "task-tag-word"
    view = "task_tag_words"
    key = "word"
    select = TASK_TAG_COUNTS_SELECT

    word: str
    count: int
