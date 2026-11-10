from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.driver.count_down import CountDown
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan

READERS_MISSING_FIELDS = NudgeDeclaration("processes.readers_missing_fields", NudgeType.STEERING, "{count} readers need required fields; draft one when an agent asks")


READER_REQUEST_REMINDER = Seconds(600)
READER_REQUEST = NudgeDeclaration("processes.reader_request", NudgeType.STEERING, "reader request {request}: agent {agent} needs a reader for output {output}", interval=Interval(READER_REQUEST_REMINDER), turn_limited=False)
READER_REQUEST_SPAN = ToolUseSpan(5)
READER_REQUEST_COUNTDOWN = CountDown("processes.reader_request_countdown", "reader of {command}", READER_REQUEST_SPAN)
READER_REQUEST_REFUSAL = NudgeDeclaration("processes.reader_request_refusal", NudgeType.REFUSAL, 'reader request {request} needs a reader')

READER_BLOCK = NudgeDeclaration("processes.reader_block", NudgeType.REFUSAL, "no proper reader reads output {output}")
OUTPUT_CHECK = NudgeDeclaration("processes.output_check", NudgeType.STEERING, 'output {output} still runs after {minutes} minutes: check it does its work',
                                required_command="journal output confirm {output}", wakes_agent=True, turn_limited=False)
OUTPUT_ENDED = NudgeDeclaration("processes.output_ended", NudgeType.STEERING, 'output {output} ended', turn_limited=False, wakes_agent=True)
OUTPUT_TIMEOUT = NudgeDeclaration("processes.output_timed_out", NudgeType.STEERING,
                                  'output {output} timed out after {seconds} seconds and was stopped: its output is kept', wakes_agent=True)
OUTPUT_STOPPED = NudgeDeclaration("processes.output_stopped", NudgeType.STEERING, 'output {output} was stopped part way: its output is kept, read it for what it printed so far')
HUNG_RUN = NudgeDeclaration("processes.hung_run", NudgeType.STEERING, 'output {output} printed nothing for {seconds} seconds, so it was stopped: its output is kept', wakes_agent=True)
LOOK_AT_RUN = NudgeDeclaration("processes.look_at_run", NudgeType.STEERING, 'output {output} printed nothing for {seconds} seconds but uses processor time: read it, and stop it if it hangs',
                               wakes_agent=True)
READER_DRAFT = NudgeDeclaration("processes.draft_a_reader", NudgeType.STEERING, 'no reader reads {name} yet', required_command="journal reader add {name}")
MONITOR_NOTE = NudgeDeclaration("processes.use_a_monitor", NudgeType.STEERING, 'do not ask again for output {output}: set a Monitor on its wait',
                               plural_text='do not ask again for outputs {output}: set a Monitor on each wait', id_field="output")
REQUIRED_MONITOR = NudgeDeclaration("processes.monitor_required", NudgeType.REFUSAL, 'output {output} still runs: set a Monitor on its wait before you stop')
REQUIRED_MONITOR_COMMAND = NudgeDeclaration("processes.monitor_command_required", NudgeType.REFUSAL, 'output {output} still runs: wait for it before you stop')
MONITOR_COMMAND_NOTE = NudgeDeclaration("processes.use_the_monitor_command", NudgeType.STEERING, 'do not ask again for output {output}: wait for it, which ends when the run does',
                                       plural_text='do not ask again for outputs {output}: wait for each, which ends when its run does', id_field="output")
AUTOMATIC_RUN_WATCHED = NudgeDeclaration("processes.automatic_run_watched", NudgeType.STEERING, 'output {output} is watched for you: go on working or stop; you are told when it ends, or started again if you stopped',
                                       plural_text='outputs {output} are watched for you: go on working or stop; you are told when they end, or started again if you stopped', id_field="output")
MONITOR_TOOL_REQUIRED = NudgeDeclaration("processes.monitor_command_outside", NudgeType.REFUSAL, 'the output wait runs only in a Monitor: give it to the Monitor tool and keep working')
HAND_MADE_MONITOR = NudgeDeclaration("processes.hand_made_monitor", NudgeType.REFUSAL, 'do not write your own wait on an output: give the Monitor the output wait')
PROCESS_MISSING = NudgeDeclaration("processes.process_lost", NudgeType.STEERING, 'process {process} was lost: its shell is gone')
OUTPUT_PROGRESS = NudgeDeclaration("processes.output_progress", NudgeType.STEERING, 'output {output}: {percent}%')
READ_COMMAND_OUTPUT = NudgeDeclaration("processes.read_command_output", NudgeType.REFUSAL, "run the read command directly, without a pipe or redirect")
CUT_JOURNAL_COMMAND = NudgeDeclaration("processes.cut_journal_command", NudgeType.REFUSAL, 'do not cut a journal command with a pipe: use its flags')
JOURNAL_COMMAND_LAST = NudgeDeclaration("processes.journal_command_last", NudgeType.REFUSAL, 'a journal command may not follow a long command or run in a loop: run it on its own line')
REDIRECTED_RUN = NudgeDeclaration("processes.redirected_run", NudgeType.STEERING, '{programs} goes to a file, so no reader sees it: run it without the redirect, and read it by its output number')
RUNNER_MISSING = NudgeDeclaration("processes.runner_missing", NudgeType.STEERING, 'journal-run is not installed in {folder}: your shell lines run as written and are not kept')
SANDBOX_RUNNER_MISSING = NudgeDeclaration("processes.sandbox_runner_missing", NudgeType.REFUSAL, "read-only shell sandbox needs journal-run: install the runner before running this line")
SANDBOX_PARSE_ERROR = NudgeDeclaration("processes.sandbox_parse_error", NudgeType.REFUSAL, "read-only shell sandbox cannot run an unparsed line: split it into simpler commands")
SANDBOX_FOLDER_MISSING = NudgeDeclaration("processes.sandbox_folder_missing", NudgeType.REFUSAL, "the shell sandbox needs a registered folder and this agent has none: start the agent again through its start command")
MOVE_BAN = NudgeDeclaration("processes.do_not_move", NudgeType.REFUSAL, 'do not move with cd: you are in {folder}; use paths, or a tool flag such as npm --prefix')
OUTPUT_RUNNING = NudgeDeclaration("processes.output_running", NudgeType.STEERING, 'output {output}: running')
SILENT_RUN_HELD = NudgeDeclaration("processes.silent_run_held", NudgeType.REFUSAL,
                                   "output {output} printed nothing for {seconds} seconds, processor time {processor}: read or stop it. Last lines: {lines}", full_text=True)
SLEEP_REFUSED = NudgeDeclaration("processes.sleep_refused", NudgeType.REFUSAL, 'a sleep is refused: you are told when a run ends')
RUN_NAME = NudgeDeclaration("processes.name_the_run", NudgeType.STEERING, 'output {process} has its raw command as its title: give it a title', required_command="journal output title {process}")

SILENT_RUN_INTERVAL = Seconds(600)
SILENT_RUN =NudgeDeclaration("processes.silent_run", NudgeType.NOTICE, "output {output} printed nothing for {seconds} seconds, so its output is not streaming: {hint}",
                              interval=Interval(SILENT_RUN_INTERVAL))
SILENT_SAVED_RUN = NudgeDeclaration("processes.silent_saved_run", NudgeType.NOTICE,
                                    "alias {name} printed nothing for {seconds} seconds: make it print each step; this run stays silent, the next shows its steps",
                                    interval=Interval(SILENT_RUN_INTERVAL))
SILENT_SAVED_PACKAGES = NudgeDeclaration("processes.silent_saved_packages", NudgeType.NOTICE,
                                         "alias {name} printed nothing for {seconds} seconds: go test over several packages holds back each package's output until it is done, so run one package at a time, or with -p 1; this run stays silent, the next shows its steps",
                                         interval=Interval(SILENT_RUN_INTERVAL))
SILENT_SAVED_FAILURE = NudgeDeclaration("processes.silent_saved_failure", NudgeType.STEERING, "saved command {name} failed and printed nothing, fix its line",
                                        interval=Interval(SILENT_RUN_INTERVAL))
STALLED_RUN = NudgeDeclaration("processes.stalled_run", NudgeType.NOTICE, "output {output} has written nothing for {seconds} seconds and still runs: {hint}",
                               interval=Interval(SILENT_RUN_INTERVAL))
READER_MISSED = NudgeDeclaration("processes.reader_missed", NudgeType.STEERING, 'reader {reader} picked none of {lines} lines of output {output}', required_command="journal reader add {reader}")
READER_WIDTH = NudgeDeclaration("processes.reader_too_wide", NudgeType.STEERING, 'reader {reader} kept {kept} of {lines} lines of output {output}', required_command="journal reader add {reader}")
READER_SUMMARY_MISSING = NudgeDeclaration("processes.reader_no_summary", NudgeType.STEERING, 'reader {reader} found no summary in output {output}', required_command="journal reader add {reader}")
READER_PROGRESS_MISSING = NudgeDeclaration("processes.reader_no_progress", NudgeType.STEERING, 'output {output} ran with no progress: give reader {reader} a --progress or --step pattern')

ALIAS_SUGGESTION = NudgeDeclaration("processes.alias_suggestion", NudgeType.STEERING, 'you ran {shape} {count} times: save it as an alias', interval=Interval(Seconds(3600)))
READER_HINT = NudgeDeclaration("processes.reader_hint", NudgeType.STEERING, "reader {reader} already reads output {output}", interval=Interval(Seconds(600)))
SHARED_TITLE = NudgeDeclaration("processes.shared_title", NudgeType.STEERING, "outputs {outputs} share one title: give each its own", interval=Interval(Seconds(600)))
RUN_QUEUE_HALTED = NudgeDeclaration("processes.run_queue_halted", NudgeType.STEERING, "the process queue is halted, so no queued run starts: resume it when it may go on", interval=Interval(Seconds(300)), turn_limited=False)
UPDATE_WAITING = NudgeDeclaration("processes.update_waiting", NudgeType.STEERING, "an update waits for {outputs} to end: no new command starts until it is done", interval=Interval(Seconds(300)), turn_limited=False)
LARGE_OUTPUT_READ = NudgeDeclaration("processes.large_output_read", NudgeType.STEERING, "output {output} has {lines} lines: read it with --summary, --tail K or --lines A-B", interval=Interval(Seconds(604800)))
RETRY_LOOP = NudgeDeclaration("processes.retry_loop", NudgeType.REFUSAL, "no retry loops: run the command once and read its error")
FAILED_FULL_RUN = NudgeDeclaration("processes.failed_full_run", NudgeType.REFUSAL, "your last full test run failed: re-run the failed tests by name first", turn_limited=False)
SILENT_START_TAUGHT = NudgeDeclaration("processes.silent_start_taught", NudgeType.NOTICE,
                                       "{name} ran {seconds} seconds and showed no percent in the chat. Its output has the line shape {shape}, and it {hint}. A reader reads the kept output, so add or adjust one now: it applies to a run that is still going at once, so never wait for the run to end.")
SILENT_START_REFUSED = NudgeDeclaration("processes.silent_start_refused", NudgeType.REFUSAL, "{name} ran silent twice: make its reader, or skip once and say why no progress can be shown")
SILENT_START_READY = NudgeDeclaration("processes.silent_start_ready", NudgeType.NOTICE, "a reader for {name} that fits the shape {shape}: {reader}", path_fields=tuple(["reader"]))
SILENT_START_FIXED = NudgeDeclaration("processes.silent_start_fixed", NudgeType.STEERING, "{name} now shows its progress in the chat")

PROCESS_NUDGES = [OUTPUT_STOPPED, HUNG_RUN, SILENT_START_TAUGHT, SILENT_START_REFUSED, SILENT_START_READY, SILENT_START_FIXED, OUTPUT_CHECK, READ_COMMAND_OUTPUT, FAILED_FULL_RUN, SANDBOX_RUNNER_MISSING, SANDBOX_PARSE_ERROR, SANDBOX_FOLDER_MISSING, RETRY_LOOP, OUTPUT_TIMEOUT, READERS_MISSING_FIELDS, STALLED_RUN, READER_REQUEST, READER_REQUEST_COUNTDOWN.declaration, READER_REQUEST_REFUSAL, READER_BLOCK, LARGE_OUTPUT_READ, RUN_QUEUE_HALTED, UPDATE_WAITING, REQUIRED_MONITOR, REQUIRED_MONITOR_COMMAND, MONITOR_NOTE, MONITOR_COMMAND_NOTE, AUTOMATIC_RUN_WATCHED, MONITOR_TOOL_REQUIRED, HAND_MADE_MONITOR, ALIAS_SUGGESTION, READER_HINT, SHARED_TITLE, SILENT_RUN, SILENT_SAVED_RUN, SILENT_SAVED_PACKAGES, SILENT_SAVED_FAILURE, READER_MISSED, READER_WIDTH, READER_SUMMARY_MISSING, READER_PROGRESS_MISSING, OUTPUT_ENDED, READER_DRAFT, PROCESS_MISSING, OUTPUT_PROGRESS, CUT_JOURNAL_COMMAND, JOURNAL_COMMAND_LAST, REDIRECTED_RUN, RUNNER_MISSING, MOVE_BAN, OUTPUT_RUNNING, SLEEP_REFUSED, SILENT_RUN_HELD, RUN_NAME, LOOK_AT_RUN]
