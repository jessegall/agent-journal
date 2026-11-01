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

PIPED_RUN = NudgeDeclaration("processes.piped_run", NudgeType.INSTRUCTION, "{programs} is cut by a pipe, so its reader sees only what is left: run it without the pipe, then journal output read <n> --summary")
SILENT_RUN = NudgeDeclaration("processes.silent_run", NudgeType.REMARK, "output {output} has printed nothing for {seconds} seconds, so it may buffer: run it with stdbuf -oL, python -u or its streaming flag")
READER_MISSED = NudgeDeclaration("processes.reader_missed", NudgeType.INSTRUCTION, "reader {reader} picked no line of the {lines} that output {output} printed: fix its pattern with journal reader add {reader} --lines \"<the lines that matter>\"")
READER_TOO_WIDE = NudgeDeclaration("processes.reader_too_wide", NudgeType.INSTRUCTION, "reader {reader} kept {kept} of the {lines} lines of output {output}, which reads no better than the output: narrow it with journal reader add {reader} --lines \"<the lines that matter>\"")
READER_NO_SUMMARY = NudgeDeclaration("processes.reader_no_summary", NudgeType.INSTRUCTION, "reader {reader} found no summary in output {output}: give it one with journal reader add {reader} --summary \"<a pattern of the last line>\"")
READER_NO_PROGRESS = NudgeDeclaration("processes.reader_no_progress", NudgeType.REMARK, "output {output} prints a count its card draws no bar for: give reader {reader} a --progress pattern such as \"\\[ *([0-9]+)%\\]\"")

ALIAS_SUGGESTION = NudgeDeclaration("processes.alias_suggestion", NudgeType.REMARK, 'you ran {shape} {count} times: add an alias with journal alias add <name> "<line>"', repeat_seconds=3600)
READER_HINT = NudgeDeclaration("processes.reader_hint", NudgeType.REMARK, "reader {reader} already reads output {output}: journal output read {output} --summary gives its lines", repeat_seconds=600)
FLAGGED_TITLE = NudgeDeclaration("processes.flagged_title", NudgeType.REMARK, "output {output}'s title {title} is a flag or a path: title it in words with journal output title {output} \"<what it does>\"", once_per_turn=False)
SHARED_TITLE = NudgeDeclaration("processes.shared_title", NudgeType.REMARK, "outputs {outputs} share the title {title}: give each its own with journal output title <n> \"<what it does>\"", repeat_seconds=600)
PROCESS_NUDGES = [ALIAS_SUGGESTION, READER_HINT, FLAGGED_TITLE, SHARED_TITLE, PIPED_RUN, SILENT_RUN, READER_MISSED, READER_TOO_WIDE, READER_NO_SUMMARY, READER_NO_PROGRESS, OUTPUT_ENDED, DRAFT_A_READER, USE_A_MONITOR, PROCESS_LOST, OUTPUT_PROGRESS, CUT_JOURNAL_COMMAND, JOURNAL_COMMAND_LAST, REDIRECTED_RUN, RUNNER_MISSING, DO_NOT_MOVE, UNREAD_OUTPUT, SLEEP_REFUSED, NAME_THE_RUN]
