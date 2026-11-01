from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

OUTPUT_ENDED = NudgeDeclaration("processes.output_ended", NudgeType.REMARK, '{text}')
DRAFT_A_READER = NudgeDeclaration("processes.draft_a_reader", NudgeType.INSTRUCTION, '{text}')
USE_A_MONITOR = NudgeDeclaration("processes.use_a_monitor", NudgeType.INSTRUCTION, 'do not ask again for output {output}: set a Monitor that ends when .journal/processes/{output}/end exists')
PROCESS_LOST = NudgeDeclaration("processes.process_lost", NudgeType.REMARK, 'process {process} was lost: its shell is gone; journal output read {process} --summary')
OUTPUT_PROGRESS = NudgeDeclaration("processes.output_progress", NudgeType.REMARK, 'output {output}: {percent}%')
CUT_JOURNAL_COMMAND = NudgeDeclaration("processes.cut_journal_command", NudgeType.REFUSAL, 'do not cut a journal command with a pipe: use its flags, such as journal output read N --lines A-B')
JOURNAL_COMMAND_LAST = NudgeDeclaration("processes.journal_command_last", NudgeType.REFUSAL, 'a journal command may not follow a long command or run in a loop: run it on its own line')
REDIRECTED_RUN = NudgeDeclaration("processes.redirected_run", NudgeType.INSTRUCTION, '{programs} goes to a file, so no reader sees it: run it without the redirect, then journal output read <n> --summary')
RUNNER_MISSING = NudgeDeclaration("processes.runner_missing", NudgeType.REMARK, 'journal-run is not installed in {folder}, so your shell lines run as you wrote them and are not kept as numbered outputs')
DO_NOT_MOVE = NudgeDeclaration("processes.do_not_move", NudgeType.REFUSAL, 'do not move with cd: you are in {folder}, so name paths from there; a tool takes its own folder, such as npm --prefix or vitest --root')
UNREAD_OUTPUT = NudgeDeclaration("processes.unread_output", NudgeType.INSTRUCTION, 'output {outputs} unread: journal output read {first} --summary')
SLEEP_REFUSED = NudgeDeclaration("processes.sleep_refused", NudgeType.REFUSAL, 'a sleep with nothing to wait on is refused: {advice}')
NAME_THE_RUN = NudgeDeclaration("processes.name_the_run", NudgeType.INSTRUCTION, 'output {process} is docked with its raw command as its title: name what it does with journal output title {process} "<what it does>", or give its reader a --title')

PROCESS_NUDGES = [OUTPUT_ENDED, DRAFT_A_READER, USE_A_MONITOR, PROCESS_LOST, OUTPUT_PROGRESS, CUT_JOURNAL_COMMAND, JOURNAL_COMMAND_LAST, REDIRECTED_RUN, RUNNER_MISSING, DO_NOT_MOVE, UNREAD_OUTPUT, SLEEP_REFUSED, NAME_THE_RUN]
