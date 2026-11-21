from journal.engine.nudge import Nudge
from journal.engine.nudge_kind import NudgeKind
from journal.support.timeout import Timeout

YEAR_SECONDS = 365 * 86400.0


class TasksNudges:
    """The nudges of the tasks feature."""

    TASK_POINTS_CHANGED = Nudge("tasks", "task_points_changed", "task {{n}}: brief point {{points|cap=15}} rewritten", "reread it with `journal task show {{n}}` and prove it again if you had", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    TASK_CHANGED = Nudge("tasks", "task_changed", "task {{n}} changed", "read it again with `journal task show {{n}}`", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)

    TASK_CONTINUATION = Nudge("tasks", "carry_on", "{{name}} is in hand: carry on", repeat=Timeout.seconds(0))
    STOP_LOG_REQUEST = Nudge("tasks", "log_first_at_stop", "{{name}}, {{logged}}", "log it first: {{log_command}} \"<status>\"", repeat=Timeout.seconds(0))
    STOPPED_WITH_WORK = Nudge("tasks", "woken_with_work_in_hand", "your turn ended and nothing has arrived since; the stop check, run again, answers:", "", repeat=Timeout.seconds(300))
    OPEN_TASK = Nudge("tasks", "task_still_open", "{{name}} is still open: log where it stands or finish it", repeat=Timeout.seconds(900))
    UNLOGGED_TASK = Nudge("tasks", "task_open_with_nothing_logged", "task {{n}} has nothing logged. log where it stands with `journal task log {{n}} \"<where it stands>\"`")
    NEXT_TASK_STARTED = Nudge("tasks", "next_task_started", "task {{n}} started", "carry on with it", repeat=Timeout.seconds(0))
    POSTPONED_WORK = Nudge("tasks", "deferred_work_is_a_task", "you deferred work in words. file it with `journal task create \"<title>\" --brief \"<what and where to start>\"`")
    COMMIT_CLOSURE = Nudge("tasks", "closed_by_commit", "commit {{sha}} closed {{tasks|cap=89}}", kind=NudgeKind.REMARK)
    STOP_POLLING = Nudge("tasks", "stop_polling", "you ran {{command|cap=50}} {{times}} times in a row", "stop polling; wait for it")
    LOG_REQUEST = Nudge("tasks", "log_where_it_stands", "{{edits}} edits since you logged {{name|cap=33}}", "log where it stands: {{log}} \"<where it stands>\"", repeat=Timeout.seconds(0))
    LOG_EDIT_BLOCK = Nudge("tasks", "write_held_until_logged", "{{edits}} edits since you logged {{name}}", "writes wait for {{log}} \"<what was done>\"", repeat=Timeout.seconds(0))
    CURRENT_TASK_REMINDER = Nudge("tasks", "task_in_hand_repeated", "{{name}} in hand, {{edits}} edits", repeat=Timeout.seconds(0))
    BLOCKED_REVIEW = Nudge("tasks", "check_the_blocked_tasks", "tasks {{tasks|cap=30}} are blocked", "`journal task unblock <n>` what you can, else `journal stuck \"<why>\"`", repeat=Timeout.seconds(0))
    WAIT_CHECK = Nudge("tasks", "check_the_wait", "you have waited {{minutes}} minutes on {{what|cap=31}}", "read its latest lines and check it does what you expect", repeat=Timeout.seconds(300), blocks_regardless=True)
    IDLE_CHECK = Nudge("tasks", "check_in_after_quiet", "nothing has happened for half an hour", "carry on, take the next task, or say in one line why not", repeat=Timeout.seconds(1800))
    WAIT_LIFTED = Nudge("tasks", "wait_lifted", "your wait on {{what|cap=19}} was lifted; check {{n}} still runs. remove it if not needed: `journal check remove {{n}}`", repeat=Timeout.seconds(0))
    WAIT_CHECK_PASSED = Nudge("tasks", "wait_check_passed", "{{what|cap=30}} is done: {{lines|cap=78}}", repeat=Timeout.seconds(0))
    WAIT_END = Nudge("tasks", "wait_over", "wait over: {{outcome|cap=100}}", repeat=Timeout.seconds(0))
    PRIORITIES_REMINDER = Nudge("tasks", "give_tasks_their_priority", "tasks {{tasks|cap=13}} need a priority: `journal task edit <n> --priority <level>`, or `journal task priorities confirm`", "", repeat=Timeout.seconds(YEAR_SECONDS), blocks_regardless=True)
    PRIORITIES_REFUSAL = Nudge("tasks", "tasks_wait_for_their_priority", "writes wait: tasks {{tasks|cap=20}} need a priority, `journal task edit <n> --priority <level>` or `journal task priorities confirm`", "", repeat=Timeout.seconds(0), longest_characters=140, longest_reason="a hold that must name both ways out of it")
    UNTESTED_TASK_EDITS = Nudge("tasks", "blocked_with_untested_edits", "task {{n}} was blocked with edits no test run has checked", "if it only waits for its tests, `journal task test {{n}}`", repeat=Timeout.seconds(0))
    TESTING_SUGGESTION = Nudge("tasks", "testing_offered", "task {{n}} is in progress and a test run starts", "testing it? `journal task test {{n}}`, then `journal output test <n>`", repeat=Timeout.tool_uses(25))
    TEST_FAILURE = Nudge("tasks", "tested_task_back", "task {{n}}'s run, output {{output}}, failed: {{outcome|cap=28}}", "`journal task start {{n}}` takes it up", repeat=Timeout.seconds(0))
    WAIT_LONG = Nudge("tasks", "park_the_wait", "{{what|cap=18}} has about {{seconds}} seconds left, too long to wait", "carry on with task {{n}}; you are informed when it ends", repeat=Timeout.seconds(0))
    WAIT_NEXT_TASK = Nudge("tasks", "next_task_while_waiting", "while you wait for {{what}}, work on task {{n}}; you are informed when the wait ends", "", repeat=Timeout.seconds(0))
    WAIT_STOP = Nudge("tasks", "no_stop_while_waiting", "{{what|cap=24}} still runs ({{left|cap=16}})", "do not stop; carry on with task {{n}} until it ends", repeat=Timeout.seconds(0))
    WAIT_SWITCH_REFUSAL = Nudge("tasks", "await_switches_task", "{{what|cap=16}} runs {{left}}: too long", "work on task {{n}} meanwhile: `journal task start {{n}}`", repeat=Timeout.seconds(0))
    WAIT_REFUSAL = Nudge("tasks", "await_only_what_ends_soon", "{{what|cap=24}} runs {{left}}, too long to wait", "carry on with task {{n}}; you are informed when it ends", repeat=Timeout.seconds(0))
    WAIT_REASON_REQUEST = Nudge("tasks", "await_needs_its_reason", "{{what|cap=16}} runs {{left}}; to wait anyway, say why", "add --why \"<why>\" to the await", repeat=Timeout.seconds(0))
    WAIT_REASON_LINE = Nudge("tasks", "await_with_its_reason", "waiting because {{why|cap=48}}", "do any open work that does not depend on it meanwhile", repeat=Timeout.seconds(0), kind=NudgeKind.REMARK)
    OUTPUT_POLL_REFUSAL = Nudge("tasks", "output_polled", "do not poll output {{n}}", "wait for it: `journal await \"<what>\" --output {{n}}`", repeat=Timeout.seconds(0))
    TASK_ARRIVED = Nudge("tasks", "task_arrived", "task {{n}} came here from environment {{source}}, {{state}}", "read it with `journal task show {{n}}`", repeat=Timeout.seconds(0))
    TASK_OPENED = Nudge("tasks", "task_opened", "task {{n}} is open", "take it up with `journal task start {{n}}`", repeat=Timeout.seconds(0))
    TASKS_RELEASED = Nudge("tasks", "tasks_released", "worker {{worker}} released {{tasks|cap=50}}", "take them up with `journal task start <n>`", repeat=Timeout.seconds(0))
    TASK_REOPENED = Nudge("tasks", "task_reopened", "task {{n}} is open again: {{reason|cap=51}}", "take it up with `journal task start {{n}}`", repeat=Timeout.seconds(0))
    BROKEN_WAIT = Nudge("tasks", "fix_the_broken_wait", "{{waits}}", "fix it with `journal task block <n> --until \"<command>\"`, or `journal task unblock <n>`", repeat=Timeout.seconds(0))
    LOOSE_BLOCKS = Nudge("tasks", "blocked_tasks_without_wait", "blocked with no wait: {{tasks|cap=30}}", "unblock what can go on; else `journal task block {{n}} --on task:<m>` or `--until \"<check>\"`", repeat=Timeout.seconds(60), longest_characters=150, longest_reason="a reminder that names both ways to give a block an end")
