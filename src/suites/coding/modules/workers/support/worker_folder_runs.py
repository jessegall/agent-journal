from pathlib import Path

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.scope.environment_scope import EnvironmentScope
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_program import AgentProgram
from core.modules.processes.commands.stop_process.stop_process import StopProcess
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from core.modules.agents.support.agent_label import AgentLabel

FOLDER_RUNS_REASON = "every helper of the worker and every run in its folder is stopped"


class WorkerFolderRuns:
    """Stops programs using a worker's folder before it is removed or reused."""

    def __init__(self, worktrees: WorktreeQuery, processes: ProcessQuery, queries: Queries, scopes: Scopes,
                 program: AgentProgram, outputs: OutputFolder, bus: Bus) -> None:
        self.worktrees, self.processes, self.queries, self.scopes = worktrees, processes, queries, scopes
        self.program, self.outputs, self.bus = program, outputs, bus

    def check_owner(self, worktree: Worktree) -> None:
        folder = Path(worktree.folder)
        if folder.is_symlink():
            raise Refusal(f"worker folder {folder} is a symlink", "remove the link before preparing or removing this worktree")
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            owners = self.worktrees.open_worktrees()
        owner = next((row for row in owners if row.id != worktree.id and Path(row.folder).resolve() == folder.resolve()), None)
        if owner is not None:
            raise Refusal(f"a worker still owns {folder}", "merge or release its worktree first")

    def stop(self, worktree: Worktree) -> None:
        folder = Path(worktree.folder).resolve()
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            worker = self.queries.query(Agent).find(worktree.session_agent_id)
            self.stop_agent(worker, folder)
            helpers = tuple(self.queries.query(Agent).filter(parent_id=worker.id).every_row(FOLDER_RUNS_REASON))
            for helper in helpers:
                self.stop_agent(helper, folder)
            processes = tuple(self.processes.running().every_row(FOLDER_RUNS_REASON))
        for process in processes:
            if not Path(process.folder).resolve().is_relative_to(folder):
                continue
            pid = process.pid or self.outputs.pid(process.id)
            if pid is not None and not self.program.stop_tree(pid, f"processes/{process.id}/"):
                raise Refusal(f"output {process.id} is still using {folder}", f"journal output stop {process.id}, then try again")
            self.bus.run(StopProcess(process.id), Actor.core(), environment_id=process.environment_id)

    def stop_agent(self, agent: Agent, folder: Path) -> None:
        if agent.pid is not None and not self.program.stop(agent):
            raise Refusal(f"{AgentLabel.labelled(agent).text} is still using {folder}", "stop its program before removing the worktree")
