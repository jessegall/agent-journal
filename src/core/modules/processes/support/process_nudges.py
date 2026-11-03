from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

OUTPUT_ENDED = NudgeDeclaration("processes.output_ended", NudgeType.STEERING, 'output {output} ended: {result}')
READER_DRAFT = NudgeDeclaration("processes.draft_a_reader", NudgeType.STEERING, 'no reader reads {name} yet: journal reader add {name}', required_command="journal reader add {name}")
MONITOR_NOTE = NudgeDeclaration("processes.use_a_monitor", NudgeType.STEERING, 'do not ask again for output {output}: set a Monitor on the command journal output monitor {output}', required_command="")
REQUIRED_MONITOR = NudgeDeclaration("processes.monitor_required", NudgeType.REFUSAL, 'output {output} moved to the background: set a Monitor on journal output monitor {output} first')
MONITOR_TOOL_REQUIRED = NudgeDeclaration("processes.monitor_command_outside", NudgeType.REFUSAL, 'journal output monitor runs only in a Monitor: give it to the Monitor tool and keep working')
HAND_MADE_MONITOR = NudgeDeclaration("processes.hand_made_monitor", NudgeType.REFUSAL, 'do not write your own wait on an output: give the Monitor the command journal output monitor <n>')
PROCESS_MISSING = NudgeDeclaration("processes.process_lost", NudgeType.STEERING, 'process {process} was lost: its shell is gone')
OUTPUT_PROGRESS = NudgeDeclaration("processes.output_progress", NudgeType.STEERING, 'output {output}: {percent}%')
CUT_JOURNAL_COMMAND = NudgeDeclaration("processes.cut_journal_command", NudgeType.REFUSAL, 'do not cut a journal command with a pipe: use its flags, such as journal output read N --lines A-B')
JOURNAL_COMMAND_LAST = NudgeDeclaration("processes.journal_command_last", NudgeType.REFUSAL, 'a journal command may not follow a long command or run in a loop: run it on its own line')
REDIRECTED_RUN = NudgeDeclaration("processes.redirected_run", NudgeType.STEERING, '{programs} goes to a file, so no reader sees it: run it without the redirect, and read it by its output number', required_command="")
RUNNER_MISSING = NudgeDeclaration("processes.runner_missing", NudgeType.STEERING, 'journal-run is not installed in {folder}: your shell lines run as written and are not kept')
MOVE_BAN = NudgeDeclaration("processes.do_not_move", NudgeType.REFUSAL, 'do not move with cd: you are in {folder}; use paths, or a tool flag such as npm --prefix')
OUTPUT_RUNNING = NudgeDeclaration("processes.output_running", NudgeType.STEERING, 'output {output}: running')
SLEEP_REFUSED = NudgeDeclaration("processes.sleep_refused", NudgeType.REFUSAL, 'a sleep with nothing to wait on is refused: give the run to a Monitor, or journal wait on "<what>"')
RUN_NAME = NudgeDeclaration("processes.name_the_run", NudgeType.STEERING, 'output {process} has its raw command as its title: journal output title {process} "<what it does>"', required_command="journal output title {process}")

PIPED_RUN = NudgeDeclaration("processes.piped_run", NudgeType.STEERING, "{programs} is cut by a pipe, so its reader sees only what is left: run it without the pipe", required_command="")
SILENT_RUN = NudgeDeclaration("processes.silent_run", NudgeType.STEERING, 'output {output} printed nothing for {seconds} seconds, so it may buffer: use stdbuf -oL or python -u')
READER_MISSED = NudgeDeclaration("processes.reader_missed", NudgeType.STEERING, 'reader {reader} picked none of {lines} lines of output {output}: journal reader add {reader} --lines "<pattern>"', required_command="journal reader add {reader}")
READER_WIDTH = NudgeDeclaration("processes.reader_too_wide", NudgeType.STEERING, 'reader {reader} kept {kept} of {lines} lines of output {output}: journal reader add {reader} --lines "<pattern>"', required_command="journal reader add {reader}")
READER_SUMMARY_MISSING = NudgeDeclaration("processes.reader_no_summary", NudgeType.STEERING, 'reader {reader} found no summary in output {output}: journal reader add {reader} --summary "<pattern>"', required_command="journal reader add {reader}")
READER_PROGRESS_MISSING = NudgeDeclaration("processes.reader_no_progress", NudgeType.STEERING, 'output {output} prints a count with no bar: give reader {reader} a --progress pattern')

ALIAS_SUGGESTION = NudgeDeclaration("processes.alias_suggestion", NudgeType.STEERING, 'you ran {shape} {count} times: add an alias with journal alias add <name> "<line>"', interval=Interval(Seconds(3600)))
READER_HINT = NudgeDeclaration("processes.reader_hint", NudgeType.STEERING, "reader {reader} already reads output {output}", interval=Interval(Seconds(600)))
SHARED_TITLE = NudgeDeclaration("processes.shared_title", NudgeType.STEERING, "outputs {outputs} share one title: give each its own with journal output title <n> \"<what it does>\"", interval=Interval(Seconds(600)))
RUN_QUEUE_HALTED = NudgeDeclaration("processes.run_queue_halted", NudgeType.STEERING, "the test queue is halted, so no queued run starts: journal queue resume when it may go on", interval=Interval(Seconds(300)), turn_limited=False)
PROCESS_NUDGES = [RUN_QUEUE_HALTED, REQUIRED_MONITOR, MONITOR_TOOL_REQUIRED, HAND_MADE_MONITOR, ALIAS_SUGGESTION, READER_HINT, SHARED_TITLE, PIPED_RUN, SILENT_RUN, READER_MISSED, READER_WIDTH, READER_SUMMARY_MISSING, READER_PROGRESS_MISSING, OUTPUT_ENDED, READER_DRAFT, MONITOR_NOTE, PROCESS_MISSING, OUTPUT_PROGRESS, CUT_JOURNAL_COMMAND, JOURNAL_COMMAND_LAST, REDIRECTED_RUN, RUNNER_MISSING, MOVE_BAN, OUTPUT_RUNNING, SLEEP_REFUSED, RUN_NAME]
