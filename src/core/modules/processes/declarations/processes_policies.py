from core.modules.processes.policies.hand_made_monitor_policy import HandMadeMonitorPolicy
from core.modules.processes.policies.journal_pipe_policy import JournalPipePolicy
from core.modules.processes.policies.read_command_output_policy import ReadCommandOutputPolicy
from core.modules.processes.policies.reading_policy import ReadingPolicy
from core.modules.processes.policies.retry_loop_policy import RetryLoopPolicy
from core.modules.processes.policies.runner_sandbox_policy import RunnerSandboxPolicy
from core.modules.processes.policies.sleep_poll_policy import SleepPollPolicy

PROCESSES_POLICIES = [HandMadeMonitorPolicy, JournalPipePolicy, ReadCommandOutputPolicy, ReadingPolicy, RetryLoopPolicy, RunnerSandboxPolicy, SleepPollPolicy]
