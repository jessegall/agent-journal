from core.modules.processes.story_steps.run_asked_to_move import RunAskedToMove
from core.modules.processes.story_steps.run_beat import RunBeat
from core.modules.processes.story_steps.run_counted import RunCounted
from core.modules.processes.story_steps.run_ended import RunEnded
from core.modules.processes.story_steps.run_file_text import RunFileText
from core.modules.processes.story_steps.run_file_written import RunFileWritten
from core.modules.processes.story_steps.run_holds_a_slot import RunHoldsASlot
from core.modules.processes.story_steps.run_printed import RunPrinted
from core.modules.processes.story_steps.run_process_id import RunProcessId
from core.modules.processes.story_steps.run_started import RunStarted

# the steps the stories of runs ask for by name, for a run's output folder no command writes
PROCESSES_STORY_STEPS = [RunAskedToMove, RunBeat, RunCounted, RunEnded, RunFileText, RunFileWritten, RunHoldsASlot, RunPrinted, RunProcessId, RunStarted]
