import subprocess
import sys
from pathlib import Path

import pytest

from engine.command.bus import Bus
from engine.enums.command_category import CommandCategory
from engine.process.leftover_process import LeftoverProcess
from core.modules.agents.commands.record_agent_process.record_agent_process import RecordAgentProcess
from core.modules.processes.models.process import Process
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.support.output_folder import OutputFolder
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


@pytest.fixture
def delivered_folder(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    return story, repository, worker


@pytest.fixture(params=['', 'src/viewer'])
def writing_folder(delivered_folder, request, monkeypatch):
    story, repository, worker = delivered_folder
    folder = repository.worktree_folder(worker.id) / request.param
    folder.mkdir(parents=True, exist_ok=True)
    process = story.container.get(Bus).run(StartProcess.single_part(story.agent.id, 'python3 build.py', str(folder), CommandCategory.BUILD, 30), story.agent, environment_id=1)
    script = "from pathlib import Path\nimport sys\nroot = Path(sys.argv[2])\nprint('ready', flush=True)\nfor line in sys.stdin:\n root.mkdir(parents=True, exist_ok=True)\n (root / 'late.txt').write_text('late build')\n print('written', flush=True)\n"
    writer = subprocess.Popen([sys.executable, '-u', '-c', script, f'processes/{process.id}/run.sh', str(folder)], cwd=folder, stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True, start_new_session=True)
    assert writer.stdout.readline().strip() == 'ready'
    monkeypatch.setattr(LeftoverProcess, 'command_line', lambda pid: f'claude processes/{process.id}/run.sh' if pid == writer.pid and writer.poll() is None else '')
    story.container.get(OutputFolder).write_pid(process.id, writer.pid)
    try:
        yield story, repository, worker, process, writer
    finally:
        writer.kill()
        writer.wait(timeout=5)
        writer.stdin.close()
        writer.stdout.close()


def test_removal_stops_a_build_before_it_can_recreate_the_folder(writing_folder, monkeypatch):
    story, repository, worker, process, writer = writing_folder
    original = WorktreeGit.git

    def write_after_git(git, folder, limit, *arguments):
        finished = original(git, folder, limit, *arguments)
        if arguments[:2] == ('worktree', 'remove') and writer.poll() is None:
            writer.stdin.write('write\n')
            writer.stdin.flush()
            story.expect_rows(writer.stdout.readline().strip() == 'written')
        return finished

    monkeypatch.setattr(WorktreeGit, 'git', write_after_git)
    story.expect_success(f'worker merge --wait {worker.id}', actor=story.agent)
    repository.expect_no_folder(worker.id)
    story.expect_rows(writer.poll() is not None)
    story.expect_rows(story.row(Process, process.id).state is ProcessState.STOPPED)


def test_removal_stops_the_worker_program_before_git(writing_folder):
    story, repository, worker, process, writer = writing_folder
    story.container.get(Bus).run(RecordAgentProcess(worker.id, writer.pid), story.agent, environment_id=1)
    story.expect_success(f'worker merge --wait {worker.id}', actor=story.agent)
    repository.expect_no_folder(worker.id)
    story.expect_rows(writer.poll() is not None, story.row(Process, process.id).state is ProcessState.STOPPED)


def test_removal_stops_the_workers_helper_program(writing_folder):
    story, repository, worker, process, writer = writing_folder
    story.new_row_id(f'agent start folder-helper claude helper --parent {worker.id} --pid {writer.pid} --environment main')
    story.expect_success(f'worker merge --wait {worker.id}', actor=story.agent)
    repository.expect_no_folder(worker.id)
    story.expect_rows(writer.poll() is not None, story.row(Process, process.id).state is ProcessState.STOPPED)


def test_removal_clears_files_left_by_git(delivered_folder, monkeypatch):
    story, repository, worker = delivered_folder
    original = WorktreeGit.git

    def leave_files(git, folder, limit, *arguments):
        if arguments[:2] == ('worktree', 'remove'):
            path = Path(arguments[-1])
            (path / 'late.pyc').write_bytes(b'cache')
            return subprocess.CompletedProcess(arguments, 1, '', 'a file could not be removed')
        return original(git, folder, limit, *arguments)

    monkeypatch.setattr(WorktreeGit, 'git', leave_files)
    story.expect_success(f'worker merge --wait {worker.id}', actor=story.agent)
    repository.expect_no_folder(worker.id)


@pytest.mark.real_git
def test_send_preserves_a_registered_worktree(delivered_folder):
    story, repository, worker = delivered_folder
    story.expect_success(f'worker merge --wait {worker.id}', actor=story.agent)
    folder = repository.worktree_folder(worker.id)
    repository.git('worktree', 'add', '-b', 'separate-work', str(folder), ENVIRONMENT_BRANCH)
    (folder / 'keep.txt').write_text('unmerged work')
    task_id = story.new_row_id('task make "Separate change" --brief "Change the cart separately"', actor=story.agent)
    story.expect_refusal(f'worker send --wait {worker.id} --task {task_id}', 'git worktree still exists', actor=story.agent)
    story.expect_rows((folder / 'keep.txt').read_text() == 'unmerged work', (folder / '.git').is_file())


def test_removal_leaves_a_run_in_a_sibling_folder(delivered_folder):
    story, repository, worker = delivered_folder
    folder = str(repository.worktree_folder(worker.id)) + '-other'
    process = story.container.get(Bus).run(StartProcess.single_part(story.agent.id, 'python3 other.py', folder, CommandCategory.BUILD, 30), story.agent, environment_id=1)
    story.expect_success(f'worker merge --wait {worker.id}', actor=story.agent)
    repository.expect_no_folder(worker.id)
    story.expect_rows(story.row(Process, process.id).state is ProcessState.RUNNING)
