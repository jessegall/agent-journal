from datetime import datetime, timedelta

from journal.models.message import Message
from journal.models.model import Model
from journal.models.plan_state import PlanState
from journal.models.question import Question
from journal.models.support.ref import Ref
from journal.models.task_state import TaskState
from journal.features.reports.support.update_item import UpdateItem
from journal.repositories.docs import Docs
from journal.repositories.messages import Messages
from journal.repositories.plans import Plans
from journal.repositories.questions import Questions
from journal.repositories.reports import Reports
from journal.repositories.tasks import Tasks

FIRST_SPAN = timedelta(hours=24)
COMMITS_SHOWN = 30
SECTIONS = ("need", "done", "doing", "plans", "commits", "also")


class UpdateGathering:
    """The rows an update covers, from the end of the last update the user read, else the day before, to now, by section: what waits on the user, open questions and plans waiting for approval; the tasks done; the tasks under way; the plans under way; the commits; and the documents and other reports written."""

    def __init__(self, tasks: Tasks, plans: Plans, questions: Questions, docs: Docs, reports: Reports, messages: Messages) -> None:
        self.tasks, self.plans, self.questions, self.docs, self.reports, self.messages = tasks, plans, questions, docs, reports, messages

    def start(self, end: datetime) -> datetime:
        read = self.reports.last_read_update()
        return read[0].end_at if read and read[0].end_at else end - FIRST_SPAN

    def items(self, start: datetime, end: datetime) -> tuple[UpdateItem, ...]:
        return (
            *(self.item("need", question, question.text) for question in self.questions.open()),
            *(self.item("need", plan, plan.title_words()) for plan in self.plans.matching(state=PlanState.READY)),
            *(self.item("done", task, task.title_words()) for task in self.tasks.recent_completions(start, end)),
            *(self.item("doing", task, task.title_words()) for state in (TaskState.STARTED, TaskState.DELEGATED) for task in self.tasks.with_state(state)),
            *(self.item("plans", plan, plan.title_words()) for plan in self.plans.matching(state=PlanState.STARTED)),
            *(self.item("commits", commit, self.commit_title(commit)) for commit in self.messages.recent_commits(start, end, COMMITS_SHOWN)),
            *(self.item("also", row, row.title_words()) for row in (*self.docs.recent_docs(start, end), *self.reports.recent_reports(start, end))),
        )

    @staticmethod
    def item(section: str, row: Model | Question, title: str) -> UpdateItem:
        return UpdateItem(section, str(Ref.build(row)), title)

    @staticmethod
    def commit_title(commit: Message) -> str:
        return commit.data.get("detail") or commit.text
