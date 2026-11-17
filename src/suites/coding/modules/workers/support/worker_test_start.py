from dataclasses import replace
from pathlib import PurePosixPath

from engine.enums.command_category import CommandCategory
from engine.enums.process_type import ProcessType
from core.modules.processes.commands.start_process.start_process import StartProcess
from suites.coding.modules.workers.support.worker_settings import TEST_LIMIT_SECONDS
from suites.coding.support.worktree_checkouts import WORKTREES_FOLDER

FOLDER_MARK = "{folder}"


class WorkerTestStart:
    """Starts a test run of a worker or a checkpoint in the folder it tests. A command's {folder} becomes that
    folder relative to the project's folder, so a command that runs somewhere else that mounts the project, such
    as a container, reaches the worker's code: docker compose exec -T -w /app/{folder} app composer test."""

    @staticmethod
    def started(owner_agent_id: int, command: str, folder: str, limit_seconds: int = TEST_LIMIT_SECONDS) -> StartProcess:
        return StartProcess.single_part(owner_agent_id, WorkerTestStart.filled(command, folder), folder, CommandCategory.TEST_RUN, limit_seconds)

    @staticmethod
    def started_as_full_run(owner_agent_id: int, command: str, folder: str) -> StartProcess:
        """A checkpoint's test run: it tests the whole phase on the project's shared test resources, such as its test
        databases, so it waits in the lane of full test runs, one at a time with an agent's own full run; it is no
        full run of the project, so it closes no task in testing."""
        return replace(WorkerTestStart.started(owner_agent_id, command, folder), run_name=ProcessType.FULL_TEST_RUN.value)

    @staticmethod
    def filled(command: str, folder: str) -> str:
        if FOLDER_MARK not in command:
            return command
        _, found, below = PurePosixPath(folder).as_posix().partition(f"/{WORKTREES_FOLDER.as_posix()}/")
        relative = f"{WORKTREES_FOLDER.as_posix()}/{below}" if found else "."
        return command.replace(FOLDER_MARK, relative)
