from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType
from suites.coding.models.enums.ask_topic import AskTopic


class WorkerGitBanNudge(NudgeDeclaration):
    """The nudge coding.worker_runs_no_git."""

    key = "coding.worker_runs_no_git"
    type = NudgeType.REFUSAL
    text = 'a worker runs no git: the journal commits and merges your work. ' + AskTopic.TOOL.question_line()
    full_text = True
