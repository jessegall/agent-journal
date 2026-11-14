from dataclasses import replace

from engine.actor.actor import Actor
from engine.command.bus import Bus
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.queued_process_launch import QueuedProcessLaunch
from core.modules.processes.support.queued_process_start import QueuedProcessStart
from engine.enums.process_type import ProcessType
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.merge_hook_line import MergeHookLine

HOOK_LIMIT_SECONDS = 600


class MergeHookStarts:
    """Starts a merge hook as a process of the main agent's session, owned by the merged worker, that the runner
    starts once its place in the queue is granted, so the listener that asks for it returns at once."""

    def __init__(self, bus: Bus, agents: AgentRows, launch: QueuedProcessLaunch) -> None:
        self.bus, self.agents, self.launch = bus, agents, launch

    def start(self, folder: str, worktree: Worktree, hook: str, cause_id: int) -> None:
        main_agent = self.agents.environment_main_agent(worktree.environment_id)
        if main_agent is None:
            return
        line = MergeHookLine.build(folder, worktree, hook)
        start = replace(StartProcess.single_part(main_agent.id, line, folder, ProcessType.MERGE_HOOK.category, HOOK_LIMIT_SECONDS, part_category=ProcessType.MERGE_HOOK.value),
                        owner_agent_id=worktree.session_agent_id)
        process = self.bus.run(start, Actor.core(), cause_id=cause_id, environment_id=worktree.environment_id)
        self.launch.start(QueuedProcessStart(process, line, main_agent.session), ForegroundRun.queued_background())
