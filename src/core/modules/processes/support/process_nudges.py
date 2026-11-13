from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.support.reading_notices.exit_texts import ExitTexts
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType
from engine.driver.count_down import CountDown
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan

READERS_MISSING_FIELDS = NudgeDeclaration("processes.readers_missing_fields", NudgeType.STEERING, "{count} readers lack required fields: draft one when an agent asks")
UNREADABLE_EMPTY = NudgeDeclaration("processes.unreadable_empty", NudgeType.STEERING, "Output {output} printed nothing: its exit code is the result, so no reader is needed")
UNREADABLE_BINARY = NudgeDeclaration("processes.unreadable_binary", NudgeType.STEERING, "Output {output} is binary: use a tool made for it")
UNREADABLE_SINGLE_LINE = NudgeDeclaration("processes.unreadable_single_line", NudgeType.STEERING, "Output {output} is one redrawn line: read it with a script reader that splits on carriage returns, or mark it unreadable")
UNREADABLE_INTERACTIVE = NudgeDeclaration("processes.unreadable_interactive", NudgeType.STEERING, "Output {output} is waiting for input: stop it; no reader will be asked")
UNREADABLE_DECLARED = NudgeDeclaration("processes.unreadable_declared", NudgeType.STEERING, "Command {name} was marked unreadable")
UNREADABLE_LIFTED = NudgeDeclaration("processes.unreadable_lifted", NudgeType.STEERING, "Command {name} prints readable lines again: reader requests resume")
FREEZE_LIFTED = NudgeDeclaration("processes.hold_lifted", NudgeType.STEERING, "A user lifted the hold on output {output}")
BLOCK_LIFTED = NudgeDeclaration("processes.block_lifted", NudgeType.STEERING, "A user lifted the block on reader request {request}")
STOCK_READER_STALE = NudgeDeclaration("processes.stock_reader_behind", NudgeType.NOTICE, "Stock reader {reader} is behind the shipped one")
READ_REFUSAL = NudgeDeclaration("processes.reading_prevented", NudgeType.REFUSAL, "output {output} has no proper reader: " + ExitTexts.template(PressureLevel.PREVENT.exits), full_text=True)
UNREADABLE_AUDIT = NudgeDeclaration("processes.unreadable_audit", NudgeType.STEERING, "{count} commands are marked unreadable by agents: review them in the viewer")
READERS_NEED_REPAIR = NudgeDeclaration("processes.readers_need_repair", NudgeType.STEERING, "Reader {reader} matched nothing in its last {count} outputs: repair it",
                                      plural_text="readers {reader} picked no line of their last {count} outputs: repair them")
READONLY_MISSING_NOTICE = NudgeDeclaration("processes.read_only_missing_readers", NudgeType.STEERING, "{count} commands run by read-only helpers have no proper reader")


READER_REQUEST_REMINDER = Seconds(600)
READER_REQUEST = NudgeDeclaration("processes.reader_request", NudgeType.STEERING, "Reader request {request}: agent {agent} needs a reader for output {output}", interval=Interval(READER_REQUEST_REMINDER), turn_limited=False)
READER_REQUEST_SPAN = ToolUseSpan(5)
READER_REQUEST_COUNTDOWN = CountDown("processes.reader_request_countdown", "reader of {command}", READER_REQUEST_SPAN)
READER_REQUEST_REFUSAL = NudgeDeclaration("processes.reader_request_refusal", NudgeType.REFUSAL, "Reader request {request} needs a reader first")

READER_BLOCK = NudgeDeclaration("processes.reader_block", NudgeType.REFUSAL, "Output {output} has no reader, request {request}: run journal reader draft {request} --save, or mark it unreadable",
                                full_text=True)
OUTPUT_CHECK = NudgeDeclaration("processes.output_check", NudgeType.STEERING, "Output {output} has run {minutes} min: check it is doing its work",
                                required_command="journal output confirm {output}", wakes_agent=True, turn_limited=False)
OUTPUT_ENDED = NudgeDeclaration("processes.output_ended", NudgeType.STEERING, "Output {output} ended", turn_limited=False, wakes_agent=True)
OUTPUT_TIMEOUT = NudgeDeclaration("processes.output_timed_out", NudgeType.STEERING,
                                  "Output {output} timed out after {seconds}s and was stopped: its output is kept", wakes_agent=True)
OUTPUT_STOPPED = NudgeDeclaration("processes.output_stopped", NudgeType.STEERING, "Output {output} was stopped partway: its output is kept, read what it printed so far")
HUNG_RUN = NudgeDeclaration("processes.hung_run", NudgeType.STEERING, "Output {output} printed nothing for {seconds}s and was stopped: its output is kept", wakes_agent=True)
RUN_CHECK = NudgeDeclaration("processes.look_at_run", NudgeType.STEERING, "Output {output} printed nothing for {seconds}s but uses CPU: read it, and stop it if it hangs",
                               wakes_agent=True)
DRAFT_READY = NudgeDeclaration("processes.draft_ready", NudgeType.STEERING, "No reader reads {name} yet; a draft fits output {output}: review and save it", required_command="journal reader add {name}")
READER_FAILED = NudgeDeclaration("processes.reader_failed", NudgeType.STEERING, "Reader {reader} failed on output {output}; the full output stays readable")
READER_DRAFT = NudgeDeclaration("processes.draft_a_reader", NudgeType.STEERING, "No reader reads {name} yet: draft one", required_command="journal reader add {name}")
MONITOR_NOTE = NudgeDeclaration("processes.use_a_monitor", NudgeType.STEERING, "Do not poll output {output} again: set a Monitor on its wait",
                               plural_text='do not ask again for outputs {output}: set a Monitor on each wait', id_field="output")
REQUIRED_MONITOR = NudgeDeclaration("processes.monitor_required", NudgeType.REFUSAL, "Output {output} is still running: set a Monitor on its wait before you stop")
REQUIRED_MONITOR_COMMAND = NudgeDeclaration("processes.monitor_command_required", NudgeType.REFUSAL, "Output {output} is still running: wait for it before you stop")
MONITOR_COMMAND_NOTE = NudgeDeclaration("processes.use_the_monitor_command", NudgeType.STEERING, "Do not poll output {output} again: wait for it; the wait ends when the run does",
                                       plural_text='do not ask again for outputs {output}: wait for each, which ends when its run does', id_field="output")
AUTOMATIC_RUN_WATCHED = NudgeDeclaration("processes.automatic_run_watched", NudgeType.STEERING, "Output {output} is watched for you: keep working or stop; you are told when it ends, or started again if you stopped",
                                       plural_text='outputs {output} are watched for you: go on working or stop; you are told when they end, or started again if you stopped', id_field="output")
MONITOR_TOOL_REQUIRED = NudgeDeclaration("processes.monitor_command_outside", NudgeType.REFUSAL, "The output wait only runs in a Monitor: give it to the Monitor tool and keep working")
HAND_MADE_MONITOR = NudgeDeclaration("processes.hand_made_monitor", NudgeType.REFUSAL, "Do not write your own wait on an output: give the output wait to the Monitor")
PROCESS_MISSING = NudgeDeclaration("processes.process_lost", NudgeType.STEERING, "Process {process} was lost: its shell is gone")
OUTPUT_PROGRESS = NudgeDeclaration("processes.output_progress", NudgeType.STEERING, "Output {output}: {percent}%")
READ_COMMAND_OUTPUT = NudgeDeclaration("processes.read_command_output", NudgeType.REFUSAL, "Run the read command directly, without a pipe or redirect")
CUT_JOURNAL_COMMAND = NudgeDeclaration("processes.cut_journal_command", NudgeType.REFUSAL, "Do not pipe a journal command: use its flags")
JOURNAL_COMMAND_LAST = NudgeDeclaration("processes.journal_command_last", NudgeType.REFUSAL, "A journal command cannot follow a long command or run in a loop: put it on its own line")
REDIRECTED_RUN = NudgeDeclaration("processes.redirected_run", NudgeType.STEERING, "{programs} is redirected to a file, so no reader sees it: run it without the redirect and read it by output number")
RUNNER_MISSING = NudgeDeclaration("processes.runner_missing", NudgeType.STEERING, "journal-run is not installed in {folder}: shell lines run as written and are not kept")
SANDBOX_RUNNER_MISSING = NudgeDeclaration("processes.sandbox_runner_missing", NudgeType.REFUSAL, "The read-only sandbox needs journal-run: install the runner before running this line")
SANDBOX_PARSE_ERROR = NudgeDeclaration("processes.sandbox_parse_error", NudgeType.REFUSAL, "The read-only sandbox cannot run an unparsed line: split it into simpler commands")
SANDBOX_FOLDER_MISSING = NudgeDeclaration("processes.sandbox_folder_missing", NudgeType.REFUSAL, "The shell sandbox needs a registered folder and this agent has none: restart it through its start command")
MOVE_BAN = NudgeDeclaration("processes.do_not_move", NudgeType.REFUSAL, "Do not cd: you are in {folder}; use paths, or a tool flag such as npm --prefix")
OUTPUT_RUNNING = NudgeDeclaration("processes.output_running", NudgeType.STEERING, "Output {output}: running")
SILENT_RUN_BLOCKED = NudgeDeclaration("processes.silent_run_held", NudgeType.REFUSAL,
                                   "Output {output} printed nothing for {seconds}s, CPU time {processor}: {hint}",
                                   required_command="journal output read {output} --tail 5")
SLEEP_REFUSED = NudgeDeclaration("processes.sleep_refused", NudgeType.REFUSAL, "No sleeps: you are told when a run ends")
RUN_NAME = NudgeDeclaration("processes.name_the_run", NudgeType.STEERING, "Output {process} is titled by its raw command: give it a title", required_command="journal output title {process}")

SILENT_RUN_INTERVAL = Seconds(600)
SILENT_RUN =NudgeDeclaration("processes.silent_run", NudgeType.NOTICE, "Output {output} printed nothing for {seconds}s, so it is not streaming: {hint}",
                              interval=Interval(SILENT_RUN_INTERVAL))
SILENT_SAVED_RUN = NudgeDeclaration("processes.silent_saved_run", NudgeType.NOTICE,
                                    "Alias {name} printed nothing for {seconds}s: make it print each step. This run stays silent; the next shows its steps",
                                    interval=Interval(SILENT_RUN_INTERVAL))
SILENT_SAVED_PACKAGES = NudgeDeclaration("processes.silent_saved_packages", NudgeType.NOTICE,
                                         "Alias {name} printed nothing for {seconds}s: go test holds each package's output until it is done, so run one package at a time or with -p 1. This run stays silent; the next shows its steps",
                                         interval=Interval(SILENT_RUN_INTERVAL))
SILENT_SAVED_FAILURE = NudgeDeclaration("processes.silent_saved_failure", NudgeType.STEERING, "Saved command {name} failed without printing anything: fix its line",
                                        interval=Interval(SILENT_RUN_INTERVAL))
RUN_FROZEN = NudgeDeclaration("processes.run_frozen", NudgeType.STEERING, "Output {output} printed nothing for {seconds}s and uses no CPU: read it, or it is stopped at {limit}s",
                              wakes_agent=True)
RUN_SPARSE = NudgeDeclaration("processes.run_sparse", NudgeType.NOTICE, "Output {output} prints about once every {seconds}s, too sparse for a reader: {hint}",
                              plural_text="outputs {output} print too seldom for a reader to follow: {hint}", id_field="output")
STALLED_RUN = NudgeDeclaration("processes.stalled_run", NudgeType.NOTICE, "Output {output} has written nothing for {seconds}s and is still running: {hint}",
                               interval=Interval(SILENT_RUN_INTERVAL))
READER_MISSED = NudgeDeclaration("processes.reader_missed", NudgeType.STEERING, "Reader {reader} matched none of the {lines} lines of output {output}: fix it", required_command="journal reader add {reader}")
READER_WIDTH = NudgeDeclaration("processes.reader_too_wide", NudgeType.STEERING, "Reader {reader} kept {kept} of {lines} lines of output {output}: narrow it", required_command="journal reader add {reader}")
READER_SUMMARY_MISSING = NudgeDeclaration("processes.reader_no_summary", NudgeType.STEERING, "Reader {reader} found no summary in output {output}", required_command="journal reader add {reader}")
READER_PROGRESS_MISSING = NudgeDeclaration("processes.reader_no_progress", NudgeType.STEERING, "Output {output} showed no progress: give reader {reader} a --progress or --step pattern")

ALIAS_SUGGESTION = NudgeDeclaration("processes.alias_suggestion", NudgeType.STEERING, "You ran {shape} {count} times: save it as an alias", interval=Interval(Seconds(3600)))
READER_HINT = NudgeDeclaration("processes.reader_hint", NudgeType.STEERING, "Reader {reader} already reads output {output}", interval=Interval(Seconds(600)))
SHARED_TITLE = NudgeDeclaration("processes.shared_title", NudgeType.STEERING, "Outputs {outputs} share one title: give each its own", interval=Interval(Seconds(600)))
RUN_QUEUE_HALTED = NudgeDeclaration("processes.run_queue_halted", NudgeType.STEERING, "The process queue is halted, so no queued run starts: resume it when it may continue", interval=Interval(Seconds(300)), turn_limited=False)
UPDATE_WAITING = NudgeDeclaration("processes.update_waiting", NudgeType.STEERING, "An update waits for {outputs} to end: no new command starts until it is done", interval=Interval(Seconds(300)), turn_limited=False)
LARGE_OUTPUT_READ = NudgeDeclaration("processes.large_output_read", NudgeType.STEERING, "Output {output} has {lines} lines: read it with --summary, --tail K or --lines A-B", interval=Interval(Seconds(604800)))
RETRY_LOOP = NudgeDeclaration("processes.retry_loop", NudgeType.REFUSAL, "No retry loops: run the command once and read its error")
SILENT_START_TAUGHT = NudgeDeclaration("processes.silent_start_taught", NudgeType.NOTICE,
                                       "{name} ran {seconds}s with no percent in the chat. Its output has line shape {shape}, and it {hint}. Add or adjust a reader now: it applies to a running output at once, so do not wait for it to end.")
SILENT_START_REFUSED = NudgeDeclaration("processes.silent_start_refused", NudgeType.REFUSAL, "{name} ran silent twice: add its reader, or skip once and say why no progress can be shown")
SILENT_START_READY = NudgeDeclaration("processes.silent_start_ready", NudgeType.NOTICE, "A reader for {name} fits shape {shape}: {reader}", path_fields=tuple(["reader"]))
SILENT_START_FIXED = NudgeDeclaration("processes.silent_start_fixed", NudgeType.STEERING, "{name} now shows its progress in the chat")

PROCESS_NUDGES = [STOCK_READER_STALE, SILENT_RUN, FREEZE_LIFTED, BLOCK_LIFTED, READ_REFUSAL, UNREADABLE_AUDIT, UNREADABLE_EMPTY, UNREADABLE_BINARY, UNREADABLE_SINGLE_LINE, UNREADABLE_INTERACTIVE, UNREADABLE_DECLARED, UNREADABLE_LIFTED, READERS_NEED_REPAIR, READONLY_MISSING_NOTICE, DRAFT_READY, READER_FAILED, RUN_FROZEN, RUN_SPARSE, OUTPUT_STOPPED, HUNG_RUN, SILENT_START_TAUGHT, SILENT_START_REFUSED, SILENT_START_READY, SILENT_START_FIXED, OUTPUT_CHECK, READ_COMMAND_OUTPUT, SANDBOX_RUNNER_MISSING, SANDBOX_PARSE_ERROR, SANDBOX_FOLDER_MISSING, RETRY_LOOP, OUTPUT_TIMEOUT, READERS_MISSING_FIELDS, STALLED_RUN, READER_REQUEST, READER_REQUEST_COUNTDOWN.declaration, READER_REQUEST_REFUSAL, READER_BLOCK, LARGE_OUTPUT_READ, RUN_QUEUE_HALTED, UPDATE_WAITING, REQUIRED_MONITOR, REQUIRED_MONITOR_COMMAND, MONITOR_NOTE, MONITOR_COMMAND_NOTE, AUTOMATIC_RUN_WATCHED, MONITOR_TOOL_REQUIRED, HAND_MADE_MONITOR, ALIAS_SUGGESTION, READER_HINT, SHARED_TITLE, SILENT_SAVED_RUN, SILENT_SAVED_PACKAGES, SILENT_SAVED_FAILURE, READER_MISSED, READER_WIDTH, READER_SUMMARY_MISSING, READER_PROGRESS_MISSING, OUTPUT_ENDED, READER_DRAFT, PROCESS_MISSING, OUTPUT_PROGRESS, CUT_JOURNAL_COMMAND, JOURNAL_COMMAND_LAST, REDIRECTED_RUN, RUNNER_MISSING, MOVE_BAN, OUTPUT_RUNNING, SLEEP_REFUSED, SILENT_RUN_BLOCKED, RUN_NAME, RUN_CHECK]
