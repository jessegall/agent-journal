from journal.engine.nudge import Nudge
from journal.engine.nudge_kind import NudgeKind
from journal.models.reader_report import ReaderReport
from journal.support.timeout import Timeout


class ShellNudges:
    """The nudges of the shell feature."""

    REPORT_RAISED = Nudge("shell", "reader_report_raised", "reader report {{n}}: a reader showed a run poorly", "see the fix with `journal reader report {{n}}`", repeat=Timeout.seconds(0))
    REPORT_REFUTED = Nudge("shell", "reader_report_dismissal_refuted", "you dismissed a report that was right: {{verdicts|cap=200}}", "fix the reader: `journal reader add <name> --pattern <regex>`", repeat=Timeout.seconds(0), longest_characters=312, longest_reason="it contains the verifier's reasons whole")
    OUTPUT_STORED = Nudge("shell", "output_kept", "output {{n}}: {{counts|cap=91}}{{part|cap=16}}", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    OUTPUT_PART_STORED = Nudge("shell", "output_part_kept", "output {{n}} also contains part {{part|cap=16}}: {{counts|cap=71}}", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    BACKGROUND_MOVE = Nudge("shell", "moved_to_the_background", "moved to the background as output {{n}}", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    OPEN_OUTPUT_STOP = Nudge("shell", "stop_with_a_run_going", "output {{outputs|cap=30}} still running", "await it: `journal await \"<what>\" --output <n>`", repeat=Timeout.seconds(0))
    OUTPUTS_ENDED = Nudge("shell", "outputs_ended", "output {{n}}: {{outcome}}", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    READER_DRAFT = Nudge("shell", "draft_a_reader", "no reader reads {{part}} yet", "fill in `{{command|cap=700}}` from this run's output and run it", repeat=Timeout.seconds(0), longest_characters=800, longest_reason="it contains the reader command the agent runs")
    READER_HINT = Nudge("shell", "use_the_reader", "reader {{reader|cap=17}} already reads this: {{about}}", "use `journal output read <n> --reader {{reader|cap=17}}`", repeat=Timeout.seconds(0))
    PARTIAL_FILE_READ = Nudge("shell", "read_the_file_in_parts", "the file has {{lines}} lines; {{cap}} show at each end", "read it by offset and limit, or grep the line you need", repeat=Timeout.seconds(0))
    FOLDER_CHANGE_REFUSAL = Nudge("shell", "folder_change_refused", "do not `cd {{target|cap=25}}`: use `( cd {{target|cap=25}} && … )` or pass the folder, such as `git -C`", "", repeat=Timeout.seconds(0))
    RUN_TOTAL_MISSING = Nudge("shell", "run_counts_without_a_total", "output {{n}} prints no total, so it has no progress bar", "give its reader a `--progress` pattern such as `(\\d+)/(\\d+)`", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    RUN_COUNT_UNSHOWN = Nudge("shell", "run_count_without_a_bar", "output {{n}} prints a count its card draws no bar for", "give its reader `--progress '{{pattern}}'`", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    SILENT_RUN_HINT = Nudge("shell", "silent_run_streams", "output {{n}} buffers: silent for {{seconds}} seconds", "run it with `stdbuf -oL`, `python -u` or its streaming flag", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    PROJECT_PATH_REFUSAL = Nudge("shell", "project_path_refused", "do not use this project's absolute path; your shell is already in the project", "run: {{line|cap=300}}", repeat=Timeout.seconds(0), longest_characters=394, longest_reason="it contains the whole command line to run instead")
    JOURNAL_POLL = Nudge("shell", "journal_poll_refused", "do not poll journal commands in a shell loop", "wait with `journal await \"<what you wait for>\" --output {{n}}`", repeat=Timeout.seconds(0))
    SLEEP_LOOP_WAIT = Nudge("shell", "sleep_loop_wait", "your sleep loop is a wait now: {{title|cap=30}}", "it ends when `{{script|cap=30}}` passes", repeat=Timeout.seconds(0))
    SLEEP_LINE_REFUSAL = Nudge("shell", "sleep_line_refused", "a sleep with nothing to wait on is refused", "wait with `journal await \"<what>\" --until \"<script>\"`", repeat=Timeout.seconds(0))
    JOURNAL_COMMAND_ISOLATION = Nudge("shell", "journal_command_runs_alone", "run journal commands alone, not mixed with other commands", repeat=Timeout.seconds(0))
    BACKGROUND_CHECK = Nudge("shell", "check_the_background", "output {{background_outputs|cap=54}} still running", "check it; if it hangs, stop it and say why", repeat=Timeout.seconds(300), blocks_regardless=True)
    WATCH_VIEW = Nudge("shell", "watched_output", "output {{n}}: {{progress}}", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    UNREAD_OUTPUT = Nudge("shell", "unread_output", "{{outputs|cap=72}}, unread. read it with `journal output read <n>`", repeat=Timeout.seconds(0))
    WATCH_ENDED = Nudge("shell", "watched_output_ended", "output {{n}}: {{outcome}}", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    PIPED_JOURNAL_COMMAND = Nudge("shell", "journal_command_piped_into_a_filter", "do not pipe journal {{command|cap=38}} into {{filter}}", "run it alone and read its whole answer", repeat=Timeout.seconds(0))
    PIPED_TEST_RUN = Nudge("shell", "test_run_piped_into_a_filter", "do not pipe a test run into {{filter}}", "run `journal suite <args>`, then `journal output read <n> --reader pytest`", repeat=Timeout.seconds(0))
    ALIAS_TIME_LIMIT = Nudge("shell", "drop_alias_time_limit", "alias {{name|cap=17}} needs no time limit: `journal alias edit {{name|cap=17}} --line \"{{line|cap=26}}\"`", "", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    LINE_TIME_LIMIT = Nudge("shell", "drop_line_time_limit", "remove the time limit wrapper from {{command}}; it needs none here", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    READER_TOPIC = Nudge("shell", "give_the_reader_a_topic", "{{command|cap=25}} ran with {{count}} different arguments", "give reader {{reader|cap=25}} a `--topic` for them", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    ALIASED_LINE = Nudge("shell", "aliased_line_refused", "alias journal {{name}} runs this line: {{line|cap=25}}", "run `journal {{name}} [args]` instead", repeat=Timeout.seconds(0))
    MORE_SPECIFIC_ALIAS = Nudge("shell", "more_specific_alias_refused", "journal {{name}} already runs this line: {{line|cap=23}}", "run `journal {{name}} [args]` instead", repeat=Timeout.seconds(0))
    COMPLETE_PROGRESS_RUN = Nudge("shell", "run_stands_at_100_percent", "output {{n}} at 100% for {{seconds}} seconds", "read `journal output read {{n}}`; give its reader a pattern for that step", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    SHARED_TITLE = Nudge("shell", "give_each_run_its_own_title", "`{{first_line|cap=28}}` and `{{second_line|cap=28}}` share a title", "`journal output watch {{n}} --title \"<words>\"`", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    FLAGGED_TITLE = Nudge("shell", "name_the_run_in_words", "output {{n}}'s title {{card_title|cap=16}} is a flag or path", "title it in words: `journal output watch {{n}} --title \"<words>\"`", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    ALIAS_SUGGESTION = Nudge("shell", "add_an_alias", "you ran {{shape|cap=30}} often", "add an alias: `journal alias add <name> \"<line>\"{{reader|cap=20}}`", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)

    @staticmethod
    def report_refutations(reports: tuple[ReaderReport, ...]) -> str:
        return "; ".join(f"reader report {report.id}: {report.verdict}" for report in reports)
