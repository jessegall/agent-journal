from suites.coding.modules.workers.states.compaction_states import CompactionStates
from suites.coding.modules.workers.states.delivered_work_stop_states import DeliveredWorkStopStates
from suites.coding.modules.workers.states.main_stop_states import MainStopStates
from suites.coding.modules.workers.states.merge_job_states import MergeJobStates
from suites.coding.modules.workers.states.worker_status_first_states import WorkerStatusFirstStates
from suites.coding.modules.workers.states.worker_unit_states import WorkerUnitStates

WORKERS_STATES = [MainStopStates, WorkerUnitStates, MergeJobStates, CompactionStates, DeliveredWorkStopStates, WorkerStatusFirstStates]
