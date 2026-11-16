from core.modules.processes.story_steps.run_move_requested import RunMoveRequested
from core.modules.processes.story_steps.run_beat import RunBeat
from core.modules.processes.story_steps.run_counted import RunCounted
from core.modules.processes.story_steps.run_ended import RunEnded
from core.modules.processes.story_steps.run_file_text import RunFileText
from core.modules.processes.story_steps.run_file_saved import RunFileSaved
from core.modules.processes.story_steps.run_has_slot import RunHasSlot
from core.modules.processes.story_steps.run_showed_output import RunShowedOutput
from core.modules.processes.story_steps.run_process_id import RunProcessId
from core.modules.processes.story_steps.run_started import RunStarted

# the steps the stories of runs ask for by name, for a run's output folder no command writes
PROCESSES_STORY_STEPS = [RunMoveRequested, RunBeat, RunCounted, RunEnded, RunFileText, RunFileSaved, RunHasSlot, RunShowedOutput, RunProcessId, RunStarted]
