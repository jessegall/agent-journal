from engine.time.clock import Clock
from engine.container.container import Container
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch

LAUNCH_GRACE_SECONDS = 30


class UnlaunchedWorkerTestRuns:
    """Every 15 seconds, a worker test whose run is open but whose runner never started, as when a server update came
    between the run and its launch, is launched a second time, before the run is ended as lost."""

    def __call__(self, container: Container) -> None:
        folder, current = container.get(OutputFolder), container.get(Clock).timestamp()
        runs = {process.id: process for process in container.get(ProcessQuery).running().all_rows()}
        stalled = [(runs[proof.process_id], proof.test_command) for proof in container.get(ProofQuery).test_rows()
                   if proof.state is ProofState.RUNNING and proof.process_id in runs and self.is_unlaunched(runs[proof.process_id], folder, current)]
        agents = {agent.id: agent for agent in container.get(Queries).query(Agent).find_many([process.session_agent_id for process, _ in stalled])}
        for process, line in stalled:
            container.get(WorkerTestLaunch).start(process, line, agents[process.session_agent_id].session)

    @staticmethod
    def is_unlaunched(process: Process, folder: OutputFolder, current: Timestamp) -> bool:
        return folder.pid(process.id) is None and process.creation_timestamp().elapsed_seconds(current) > LAUNCH_GRACE_SECONDS
