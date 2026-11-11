from dataclasses import dataclass

from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from suites.coding.modules.workers.support.worker_step_facts import WorkerStepFacts


@dataclass(frozen=True)
class WorkerStepText:
    """The three parts of the sentence a worker hears at one point of its round."""

    outcome_text: str
    action_text: str
    next_text: str

    def line(self, facts: WorkerStepFacts) -> str:
        filled = facts.words()
        return f"{self.outcome_text.format_map(filled)} Now: {self.action_text.format_map(filled)}. Then: {self.next_text.format_map(filled)}."


STEP_TEXTS = {
    WorkerStep.BUILD: WorkerStepText("Task {task} is not finished{missing}.", "prove each point of its brief with journal proof make, then journal worker commit", "{open_tasks} started{unit_open}, own test runs available: {runs}"),
    WorkerStep.COMMIT: WorkerStepText("{proven} proven.", "{commit}", "{commit_tests}"),
    WorkerStep.WAIT: WorkerStepText("{waiting}", "stop", "you are woken when its tests end, and started on your next task when it is merged"),
    WorkerStep.FIX: WorkerStepText("The tests of {label} failed.", "fix the failing tests, show the proof again with journal proof make and run journal worker commit, running tests freely until then", "the next commit reruns only what failed"),
    WorkerStep.CONFLICT: WorkerStepText("{label} clashed with its base branch in {files}.", "settle the conflict markers in those files, then journal worker commit", f"the journal merges it again. {AskTopic.CONFLICT.question_line()}"),
    WorkerStep.BLOCKED: WorkerStepText("task {task} is blocked.", "stop", "you are woken when it opens, or when you are given another task"),
    WorkerStep.QUESTION: WorkerStepText("Your question is open.", "do the work named in the answer, or stop", "you are woken when the answer comes"),
}


def step_line(step: WorkerStep, facts: WorkerStepFacts) -> str:
    return STEP_TEXTS[step].line(facts)
