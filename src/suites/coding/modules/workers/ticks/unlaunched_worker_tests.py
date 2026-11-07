from core.base.clock import Clock
from core.base.container import Container
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch

LAUNCH_GRACE_SECONDS = 30


class UnlaunchedWorkerTests:
    """Every 15 seconds, a worker test whose run is open but whose runner never started, as when a server update came
    between the run and its launch, is launched again, before the run is ended as lost."""

    def __call__(self, container: Container) -> None:
        folder, now = container.get(OutputFolder), container.get(Clock).timestamp()
        processes = container.get(ProcessQuery)
        open_ids = {process.id for process in processes.running().all_rows()}
        for proof in container.get(ProofQuery).test_rows():
            if proof.state is ProofState.RUNNING and proof.process_id in open_ids:
                self.launch_again(container, processes.find(proof.process_id), proof.test_command, folder, now)

    @staticmethod
    def launch_again(container: Container, process: Process, line: str, folder: OutputFolder, now: Timestamp) -> None:
        if folder.pid(process.id) is not None or process.created_at.elapsed_seconds(now) <= LAUNCH_GRACE_SECONDS:
            return
        session = container.get(Queries).query(Agent).find(process.session_agent_id).session
        container.get(WorkerTestLaunch).start(process.id, line, process.folder, session)
