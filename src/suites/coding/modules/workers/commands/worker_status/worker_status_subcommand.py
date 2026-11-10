from argparse import ArgumentParser, Namespace

from engine.enums.actor_type import ActorType
from core.base.caller.caller import Caller
from engine.row.page import Page
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.unread_skills import UnreadSkills
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.proof_state import TEST_WAITING_STATES
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.support.worker_resume import WorkerResume
from suites.coding.modules.workers.support.worker_status import WorkerStatus, WorkerStatusPhase
from suites.coding.modules.workers.support.worker_status_page_json import WorkerStatusPageJson
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance


class WorkerStatusSubcommand(ReadSubcommand[WorkerStatus | Refusal]):
    cli_name = "worker"
    name = "status"

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, proofs: ProofQuery, unread_skills: UnreadSkills, files: SkillFiles, phases: WorkerPhases, resume: WorkerResume, guidance: WorkerGuidance) -> None:
        self.guidance = guidance
        self.queries, self.worktrees, self.proofs = queries, worktrees, proofs
        self.unread_skills, self.files, self.phases, self.resume = unread_skills, files, phases, resume

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int, nargs="?")
        parser.add_argument("--page", type=int, default=1)
        parser.add_argument("--limit", type=int, default=25)

    def read(self, arguments: Namespace, caller: Caller) -> WorkerStatus | Refusal:
        if arguments.page < 1 or not 1 <= arguments.limit <= 100:
            return Refusal("status needs a positive page and a limit from 1 to 100")
        if arguments.worker_id is None and caller.actor.type != ActorType.AGENT:
            return Refusal("name a worker: journal worker status <worker>")
        worker_id = arguments.worker_id if arguments.worker_id is not None else caller.actor.id
        worktree = self.worktrees.worker_worktree(worker_id)
        if worktree is None:
            return Refusal(f"agent {worker_id} has no worker worktree")
        tests = self.proofs.worktree_proofs(worktree.id).matching(Among("state", TEST_WAITING_STATES)).oldest().page(arguments.page, arguments.limit)
        assignments = self.queries.query(Task).filter(delegated_to=worker_id).matching(Among("state", (TaskState.OPEN, TaskState.BLOCKED))).oldest().page(arguments.page, arguments.limit)
        worker = self.queries.query(Agent).find(worker_id)
        skills = tuple(self.files.agent_instruction(name, worker) for name in self.unread_skills.names(worker_id))
        current_task = self.queries.query(Task).find(worktree.task_id)
        return WorkerStatus(worker_id, current_task, tests, assignments, skills, self.task_phase(current_task, worker_id), worker.program, self.resume.program_state(worker) if worker.ended_at is not None else None, self.guidance.point(worker_id), worker.paused_at is not None)

    def task_phase(self, task: Task, worker_id: int) -> WorkerStatusPhase | None:
        phase = self.phases.phase(task)
        return None if phase is None else WorkerStatusPhase(phase, len(self.phases.advanced(worker_id)))

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, WorkerStatus):
            super().write_output(value, output)
            return
        phase_lines = () if value.phase is None else (f"Current phase: phase {value.phase.phase.id} ({value.phase.phase.title})", f"Tasks waiting for its end: {value.phase.tasks_waiting}")
        pause_lines = (f"Paused: it takes no job until journal agent resume {value.worker_id}",) if value.is_paused else ()
        lines = [value.point.line, f"Point: {value.point.step}", f"Tasks left in the group: {value.point.open_task_count}", f"Own test runs left: {value.runs_text}", f"Worker: {value.worker_id}", *pause_lines, f"Current task: {value.current_task.id} ({value.current_task.state}) {value.current_task.title}", *phase_lines,
                 f"Tests waiting: {value.tests.total}", *(f"  proof {proof.id} ({proof.state}): {proof.test_command}" for proof in value.tests.rows),
                 f"Assignments remaining: {value.assignments.total}", *(f"  task {task.id} ({task.state}): {task.title}" for task in value.assignments.rows),
                 f"Skills to load: {len(value.skills)}", *(f"  {skill}" for skill in value.skills)]
        if value.program_state is not None:
            lines.append(f"Program: {value.program} — {value.program_state.wait_line}")
            if not value.program_state.is_ready:
                lines.append(f"Wait, or journal worker release {value.worker_id}")
        if not value.tests.is_last or not value.assignments.is_last:
            lines.append(f"--page {value.assignments.number + 1} for the next page")
        data: dict[str, object] = {"step": value.point.step, "guidance": value.point.line, "group": value.point.group, "open_task_count": value.point.open_task_count, "test_runs_available": value.point.test_runs_available, "worker_id": value.worker_id, "current_task": output.values(value.current_task),
                                   "tests": self.page_json(value.tests, output), "assignments": self.page_json(value.assignments, output),
                                   "phase": value.phase.listed() if value.phase is not None else None,
                                   "program": value.program, "program_state": value.program_state.listed() if value.program_state is not None else None, "paused": value.is_paused}
        output.write("\n".join(lines), data)

    def page_json(self, page: Page[Proof] | Page[Task], output: Output) -> WorkerStatusPageJson:
        return {"rows": [output.values(row) for row in page.rows], "page": page.number, "size": page.size, "total": page.total}
