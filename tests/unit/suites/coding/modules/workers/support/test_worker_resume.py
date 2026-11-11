from contextlib import nullcontext
from datetime import datetime, timezone
from types import SimpleNamespace

from suites.coding.modules.workers.support.worker_resume import WorkerResume

ENDED_AT = datetime(2026, 11, 1, 9, 0, tzinfo=timezone.utc)
WORKER = SimpleNamespace(id=7, number=3, profile="journal-worker", program="codex", program_model="gpt-6.1-terra", session="s-7", ended_at=ENDED_AT, environment_id=1)
REPLACED_WORKER = SimpleNamespace(**{**vars(WORKER), "session": "s-8"})
WORKTREE = SimpleNamespace(id=4, folder="/work/project/.journal/worktrees/main/worker-7", branch="journal/main/worker-7", environment_id=1, task_id=12)
JOB = SimpleNamespace(id=30, text="Fix the rounding of the tax")
LAUNCHER_ANSWER = "the launcher took the command"


class WorkerLaunch:
    """A worker resume built on recording stand-ins: what was replaced and what the launcher was handed."""

    def __init__(self, locked_down: bool = False, program_ready: bool = True) -> None:
        self.replaced: list[str] = []
        self.handed: list[SimpleNamespace] = []
        stored_rows = SimpleNamespace(find=lambda row_id: SimpleNamespace(id=row_id, folder="/work/project"))
        self.resume = WorkerResume(
            launcher=SimpleNamespace(hand=self.hand), queries=SimpleNamespace(query=lambda model: stored_rows), worktrees=SimpleNamespace(), worker_command=SimpleNamespace(restarted=self.restarted),
            bus=SimpleNamespace(), clock=SimpleNamespace(), requirement=SimpleNamespace(), places=SimpleNamespace(can_resume=lambda worker: True), program=SimpleNamespace(),
            states=SimpleNamespace(outage_state=lambda program: SimpleNamespace(is_ready=program_ready)), shares=SimpleNamespace(is_configured=False), environments=SimpleNamespace(),
            scopes=SimpleNamespace(row_scope=lambda row: nullcontext()), reports=SimpleNamespace(), routes=SimpleNamespace(listed=lambda: []), rows=SimpleNamespace(),
            admission=SimpleNamespace(resume_reasons=lambda role, profile: [], model_reasons=lambda role, profile, program, model: []), started_work=SimpleNamespace(),
            cold=SimpleNamespace(replaced_silent=self.replaced_silent, is_silent=lambda worker: True), instruction_files=SimpleNamespace(refresh=lambda worktree: None),
            compaction=SimpleNamespace(start_record=lambda worker: None), conversations=SimpleNamespace(exists=lambda worker: False), lockdown=SimpleNamespace(lockdown=lambda program: SimpleNamespace(is_active=locked_down)))

    def replaced_silent(self, worker) -> SimpleNamespace:
        self.replaced.append(worker.session)
        return REPLACED_WORKER

    def restarted(self, worker, worktree, environment, task, job_text) -> SimpleNamespace:
        return SimpleNamespace(session=worker.session, folder=worktree.folder, branch=worktree.branch, job_text=job_text)

    def hand(self, worker, environment, command) -> str:
        self.handed.append(command)
        return LAUNCHER_ANSWER

    def answer_name(self) -> str:
        answer = self.resume.launch_job(WORKER, WORKTREE, JOB, SimpleNamespace())
        return str(answer)


def test_a_new_session_of_a_cold_worker_is_launched_in_the_folder_and_branch_of_its_open_worktree():
    launch = WorkerLaunch()
    assert launch.answer_name() == LAUNCHER_ANSWER
    assert [(command.session, command.folder, command.branch, command.job_text) for command in launch.handed] == [("s-8", WORKTREE.folder, WORKTREE.branch, JOB.text)]


def test_a_worker_of_a_program_at_its_usage_limit_is_not_launched_and_keeps_its_session():
    launch = WorkerLaunch(locked_down=True)
    assert launch.answer_name() == "skipped"
    assert (launch.replaced, launch.handed) == ([], [])


def test_a_worker_whose_program_is_out_is_not_launched_and_keeps_its_session():
    launch = WorkerLaunch(program_ready=False)
    assert launch.answer_name() == "skipped"
    assert (launch.replaced, launch.handed) == ([], [])
