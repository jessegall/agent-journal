from pathlib import Path

from journal.features.shell.support.activity_label import ActivityLabel
from journal.features.shell.support.output_files import OutputFiles
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.models.command_output import CommandOutput
from journal.models.task import Task
from journal.models.worker import Worker
from journal.repositories.command_outputs import CommandOutputs
from journal.repositories.proofs import Proofs
from journal.support.actor import Actor

# the last lines of each test run the worker made that a reviewer is handed, where a run's verdict and its failures stand
OUTPUT_LINES = 40


class ReviewBrief:
    """What a reviewer is handed as its whole brief, for a bounded job it does on a fast model: the task's brief as it was given, each point with its latest proof, which a clock-out always has, the output of the test runs the worker made, the worker's report, where its changes are, and how to judge and report each point."""

    def __init__(self, proofs: Proofs, branch: WorkerBranch, outputs: CommandOutputs, labels: ActivityLabel) -> None:
        self.labels = labels
        self.proofs, self.branch, self.outputs = proofs, branch, outputs

    def text(self, worker: Worker, task: Task, report: str) -> str:
        latest = {proof.point: proof for proof in sorted(self.proofs.task_proofs(task), key=lambda proof: proof.row_id)}
        points = "\n".join(f"{n}. {point}\n   proof, {latest[n].state}: {latest[n].text}" for n, point in enumerate(task.points(), 1))
        folder = self.branch.place(worker)
        return f"""You are the journal's reviewer. Worker {worker.id}, {worker.name}, clocked out of task {task.id}, {task.title}. Judge its work point by point for the agent that sent it; you change no file and merge nothing.

The task's brief, as it was given:
{task.brief}

Each point and the worker's proof of it:
{points}

The output of the tests the worker ran:
{self.test_output(worker, folder)}

The worker's report:
{report}

Compare each proof with the brief and with the test output. Read the changes, git diff HEAD...{self.branch.name(worker)}, only where a proof is unclear.

Then give your one report, one line per point:
journal review "1 passed
2 short: <why, with the failing output>
3 undecided: <why you cannot decide>"
Every point passed signs the work off and merges it; a point short goes back to the worker with your reason; a point you cannot decide goes to the agent.
"""

    def test_output(self, worker: Worker, folder: Path) -> str:
        outputs = self.outputs.creator_outputs(Actor.worker(worker.id))
        runs = [output for output in outputs if self.labels.test_runs((output.command,))]
        if not runs:
            return f"the worker ran no test: run the tests its proofs name, by the commands they give, in {folder}"
        return "\n\n".join(self.run_text(run) for run in runs)

    @staticmethod
    def run_text(run: CommandOutput) -> str:
        files = OutputFiles(Path(run.folder))
        lines = files.lines()[-OUTPUT_LINES:] if files.is_stored() else []
        return "\n".join((f"$ {run.command} (exit {run.status})", *(lines or [run.summary or "no output kept"])))
