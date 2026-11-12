from suites.coding.modules.workers.support.work_units import WorkUnits
from suites.coding.modules.workers.support.worktree_runs import WorktreeRuns
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.support.merger_nudges import MERGER_PROFILE
from engine.cli.agent_number import AgentNumber
from argparse import ArgumentParser, Namespace

from engine.enums.actor_type import ActorType
from engine.caller.caller import Caller
from engine.row.page import Page
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.unread_skills import UnreadSkills
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.models.enums.proof_state import TEST_WAITING_STATES
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_resume import WorkerResume
from suites.coding.modules.workers.support.worker_status import WorkerStatus
from suites.coding.modules.workers.support.kept_worker_status import KeptWorkerStatus
from suites.coding.modules.workers.support.worker_status_page_json import WorkerStatusPageJson
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_open_tasks import WorkerOpenTasks
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers
from suites.coding.modules.workers.support.worker_questions import WorkerQuestions

UNIT_TASKS_REASON = "a worker's unit is every task assigned to it, which can hold more than fifty"


class WorkerStatusSubcommand(ReadSubcommand[WorkerStatus | KeptWorkerStatus | Refusal]):
    cli_name = "worker"
    name = "status"

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, proofs: ProofQuery, unread_skills: UnreadSkills, files: SkillFiles, resume: WorkerResume, guidance: WorkerGuidance, numbers: RowNumbers, questions: WorkerQuestions, tasks: TaskQuery, open_tasks: WorkerOpenTasks, units: WorkUnits, runs: WorktreeRuns, git: WorktreeGit) -> None:
        self.tasks, self.open_tasks, self.units, self.runs, self.git = tasks, open_tasks, units, runs, git
        self.questions = questions
        self.numbers = numbers
        self.guidance = guidance
        self.queries, self.worktrees, self.proofs = queries, worktrees, proofs
        self.unread_skills, self.files, self.resume = unread_skills, files, resume

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=AgentNumber, nargs="?")
        parser.add_argument("--page", type=int, default=1)
        parser.add_argument("--limit", type=int, default=25)

    def read(self, arguments: Namespace, caller: Caller) -> WorkerStatus | KeptWorkerStatus | Refusal:
        if arguments.page < 1 or not 1 <= arguments.limit <= 100:
            return Refusal("status needs a positive page and a limit from 1 to 100")
        if arguments.worker_id is None and caller.actor.type != ActorType.AGENT:
            return Refusal("name a worker: journal worker status <worker>")
        worker_id = arguments.worker_id if arguments.worker_id is not None else caller.actor.id
        worktree = self.worktrees.worker_worktree(worker_id)
        if worktree is None:
            return self.kept_status(worker_id)
        tests = self.proofs.worktree_proofs(worktree.id).matching(Among("state", TEST_WAITING_STATES)).oldest().page(arguments.page, arguments.limit)
        assignments = self.tasks.assignee_tasks(worker_id).matching(Among("state", (TaskState.OPEN, TaskState.BLOCKED))).oldest().page(arguments.page, arguments.limit)
        worker = self.queries.query(Agent).find(worker_id)
        skills = tuple(self.files.agent_instruction(name, worker) for name in self.unread_skills.names(worker_id))
        current_task = self.queries.query(Task).find(worktree.task_id)
        point = self.guidance.point(worker_id)
        waiting_tasks = tuple(self.tasks.assignee_tasks(worker_id).filter(state=TaskState.TESTING).every_row(UNIT_TASKS_REASON))
        return WorkerStatus(worker_id, worker.number, worktree, current_task, self.tasks.started_tasks(worker_id), point.round.required_staging(), waiting_tasks, self.open_tasks.startable(point.round), tests, assignments, skills, worker.program, self.resume.program_state(worker) if worker.ended_at is not None else None, point, worker.paused_at is not None, self.questions.status_lines(worker_id), worker.standing,
                            self.unit_line(worker_id, worktree.id), self.behind_line(worktree), self.held_by_others(worker_id))

    def behind_line(self, worktree: Worktree) -> str:
        try:
            counted = f"{self.git.behind(worktree)} behind {worktree.base_branch}"
        except Refusal as refusal:
            return f"behind {worktree.base_branch} unknown: {refusal.reason}"
        check = self.queries.query(WorktreeBehindCheck).filter(worktree_id=worktree.id).newest().first()
        decision = check.decision_text(self.decider(check.decided_by)) if check is not None else ""
        return f"{counted}; {decision}" if decision else counted

    def decider(self, agent_id: int | None) -> str:
        if agent_id is None:
            return "no one"
        agent = self.queries.query(Agent).find(agent_id)
        return "the merger" if agent.profile == MERGER_PROFILE else AgentLabel.from_agent(agent).text

    def held_by_others(self, worker_id: int) -> tuple[Task, ...]:
        """The worker's assigned tasks another agent has started, which it can neither prove nor commit."""
        return tuple(task for task in self.tasks.assignee_tasks(worker_id).filter(state=TaskState.STARTED).every_row(UNIT_TASKS_REASON) if task.holder_id not in (None, worker_id))

    def unit_line(self, worker_id: int, worktree_id: int) -> str:
        return " ".join(line for line in (self.units.unit(worker_id).status_line, self.runs.passed_text(worktree_id)) if line)

    def kept_status(self, worker_id: int) -> KeptWorkerStatus | Refusal:
        if self.worktrees.newest_worktree(worker_id) is None:
            return Refusal(f"{AgentLabel.from_row_id(worker_id, self.numbers).text} has no worker worktree")
        worker = self.queries.query(Agent).find(worker_id)
        if worker.retired_at is not None:
            return Refusal(f"{AgentLabel.from_agent(worker).text} is retired")
        return KeptWorkerStatus(worker)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, KeptWorkerStatus):
            output.write(value.line, value.listed())
            return
        if not isinstance(value, WorkerStatus):
            super().write_output(value, output)
            return
        pause_lines = [f"Paused: it takes no job until journal agent resume {value.worker_number}"] if value.is_paused else []
        unit_lines = [value.unit_line] if value.unit_line else []
        lines = [value.point.line, *unit_lines, *value.question_lines, f"Point: {value.point.step}", f"Own test runs left: {value.runs_text}", f"Worker: {value.worker_number}", f"Worktree: {value.worktree.folder} on branch {value.worktree.branch}, cut from {value.worktree.base_branch}", value.behind_line, *pause_lines, f"Current task: {value.current_task.id} ({value.current_task.state}) {value.current_task.title}",
                 f"Tasks started: {len(value.started_tasks)}", *(f"  task {task.id}: {task.title}" for task in value.started_tasks), *value.group_lines(),
                 f"Tests waiting: {value.tests.total}", *(f"  proof {proof.id} ({proof.state}): {proof.test_command}" for proof in value.tests.rows),
                 f"Assignments remaining: {value.assignments.total}", *(f"  task {task.id} ({task.state}): {task.title}" for task in value.assignments.rows),
                 f"Skills to load: {len(value.skills)}", *(f"  {skill}" for skill in value.skills)]
        lines.append(f"Standing: {value.standing.value}")
        if value.program_state is not None:
            lines.append(f"Program: {value.program} — {value.program_state.wait_line}")
            if not value.program_state.is_ready:
                lines.append(f"Wait, or journal worker release {value.worker_number}")
        if not value.tests.is_last or not value.assignments.is_last:
            lines.append(f"--page {value.assignments.number + 1} for the next page")
        data: dict[str, object] = {"step": value.point.step, "guidance": value.point.line, "commit_window": value.point.window_key, "open_task_count": value.point.open_task_count, "test_runs_available": value.point.test_runs_available, "worker_id": value.worker_id, "worktree": {"folder": value.worktree.folder, "branch": value.worktree.branch, "base_branch": value.worktree.base_branch}, "current_task": output.values(value.current_task), "started_tasks": [output.values(task) for task in value.started_tasks], "held": [output.values(task) for task in value.staging.open_tasks],
                                   "staged": [output.values(task) for task in value.staging.ready], "waiting": [output.values(task) for task in value.waiting_tasks],
                                   "startable": [output.values(task) for task in value.startable_tasks], "blocked": [output.values(task) for task in value.blocked_tasks],
                                   "tests": self.page_json(value.tests, output), "assignments": self.page_json(value.assignments, output),
                                   "program": value.program, "program_state": value.program_state.listed() if value.program_state is not None else None, "paused": value.is_paused, "questions": list(value.question_lines), "standing": value.standing.value, "unit": value.unit_line, "behind": value.behind_line}
        output.write("\n".join(lines), data)

    def page_json(self, page: Page[Proof] | Page[Task], output: Output) -> WorkerStatusPageJson:
        return {"rows": [output.values(row) for row in page.rows], "page": page.number, "size": page.size, "total": page.total}
