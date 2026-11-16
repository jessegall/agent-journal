from core.modules.processes.bindings.process_run_placement import ProcessRunPlacement
from core.modules.processes.support.agent_run_pauses import AgentRunPauses
from core.modules.processes.support.monitored_runs import MonitoredRuns
from core.modules.processes.support.process_row_wrapper import ProcessRowWrapper
from core.modules.processes.support.process_run_owners import ProcessRunOwners
from core.modules.processes.support.process_wait_targets import ProcessWaitTargets
from core.modules.processes.support.stored_execution_classes import StoredExecutionClasses
from core.modules.waits.support.wait_targets import WaitTargets
from engine.driver.run_owners import RunOwners
from engine.driver.watched_runs import WatchedRuns
from engine.execution.classes.person_classes import PersonClasses
from engine.process.door.request_records import RequestRecords
from engine.process.door.run_pauses import RunPauses
from engine.process.door.run_placement import RunPlacement

PROCESSES_BINDINGS = {WatchedRuns: MonitoredRuns, WaitTargets: ProcessWaitTargets, RunOwners: ProcessRunOwners, RunPlacement: ProcessRunPlacement, RunPauses: AgentRunPauses, RequestRecords: ProcessRowWrapper, PersonClasses: StoredExecutionClasses}
