from pathlib import Path

from journal.features.migration.support.environment_kind import EnvironmentKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.environment import Environment
from journal.models.question import Question
from journal.repositories.environments import Environments
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.questions import Questions


class QuestionImport(EnvironmentKind):
    """A question keeps its options and its answer, or stays open when it had none."""

    kind = "question"
    title = "questions"

    def __init__(self, environments: Environments, tally: MigratedRows, questions: Questions) -> None:
        super().__init__(environments, tally)
        self.questions = questions

    def created(self, row: Version3Row, target: Environment, attached: Path, actor: Actor) -> Question:
        text = "\n\n".join(part for part in (row.title, row.brief) if part)
        options = tuple(option.get("title", "") for option in row.listed("options"))
        return self.questions.imported(Question(environment_id=target.id, text=text, options=options, answer=row.outcome if row.completed else None), row.creation_time(), actor)
