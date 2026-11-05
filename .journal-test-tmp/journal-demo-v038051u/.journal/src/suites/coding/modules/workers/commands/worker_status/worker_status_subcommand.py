from argparse import ArgumentParser, Namespace

from core.base.actor_type import ActorType
from core.base.caller.caller import Caller
from core.base.page import Page
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.unread_skills import UnreadSkills
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.proof_state import TEST_WAITING_STATES
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_status import WorkerStatus
from suites.coding.modules.workers.support.worker_status_page_json import WorkerStatusPageJson


class WorkerStatusSubcommand(ReadSubcommand[WorkerStatus | Refusal]):
    cli_name = "worker"
    name = "status"

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, proofs: ProofQuery, unread_skills: UnreadSkills, files: SkillFiles) -> None:
        self.queries, self.worktrees, self.proofs = queries, worktrees, proofs
        self.unread_skills, self.files = unread_skills, files

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
        skills = tuple(f"{name}: {self.files.readable(name)}" for name in self.unread_skills.names(worker_id))
        return WorkerStatus(worker_id, self.queries.query(Task).find(worktree.task_id), tests, assignments, skills)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, WorkerStatus):
            super().write_output(value, output)
            return
        lines = [f"Worker: {value.worker_id}", f"Current task: {value.current_task.id} ({value.current_task.state}) {value.current_task.title}",
                 f"Tests waiting: {value.tests.total}", *(f"  proof {proof.id} ({proof.state}): {proof.test_command}" for proof in value.tests.rows),
                 f"Assignments remaining: {value.assignments.total}", *(f"  task {task.id} ({task.state}): {task.title}" for task in value.assignments.rows),
                 f"Skills to load: {len(value.skills)}", *(f"  {skill}" for skill in value.skills)]
        if not value.tests.is_last or not value.assignments.is_last:
            lines.append(f"--page {value.assignments.number + 1} for the next page")
        output.write("\n".join(lines), {"worker_id": value.worker_id, "current_task": output.values(value.current_task),
                                      "tests": self.page_json(value.tests, output), "assignments": self.page_json(value.assignments, output)})

    def page_json(self, page: Page[Proof] | Page[Task], output: Output) -> WorkerStatusPageJson:
        return {"rows": [output.values(row) for row in page.rows], "page": page.number, "size": page.size, "total": page.total}
