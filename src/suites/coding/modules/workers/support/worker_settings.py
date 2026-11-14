from core.modules.helpers.support.helper_settings import HELPER_TYPES_SCREEN
from engine.setting.ruled_settings import ruled_settings
from engine.enums.setting_scope import SettingScope
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue
from core.modules.helpers.support.command_pair_rule import CommandPairRule
from engine.setting.list_rule import ListRule
from engine.setting.number_rule import NumberRule
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT

from core.modules.asks.support.ask_settings import ASK_ANSWER_MINUTES, ASK_PASS_ON_MINUTES, ASK_VISITS_LIMIT

MODULE_KEY = "journal.suites.coding.workers"
DISPATCHES_WORKERS_SETTING = f"{MODULE_KEY}.main-dispatches-workers"
LIBRARY_LINKS = f"{MODULE_KEY}.library-links"
LIBRARY_COPIES = f"{MODULE_KEY}.library-copies"
PRESET_TEST_COMMANDS = f"{MODULE_KEY}.preset-test-commands"
WORKTREE_COMMANDS_NAME = "worktree-commands"
WORKTREE_COMMANDS = f"{MODULE_KEY}.{WORKTREE_COMMANDS_NAME}"
MERGE_COMMANDS_NAME = "merge-commands"
MERGE_COMMANDS = f"{MODULE_KEY}.{MERGE_COMMANDS_NAME}"
MERGE_BUILT_PATHS = f"{MODULE_KEY}.merge-built-paths"
MERGE_BUILD_COMMAND = f"{MODULE_KEY}.merge-build-command"
MERGE_HOOKS_NAME = "merge-hooks"
MERGE_HOOKS = f"{MODULE_KEY}.{MERGE_HOOKS_NAME}"
OVERSIGHT_PROFILES_NAME = "oversight-profiles"
OVERSIGHT_PROFILES = f"{MODULE_KEY}.{OVERSIGHT_PROFILES_NAME}"
WORKER_RUN_LIMIT = f"{MODULE_KEY}.worker-run-limit"
WORKER_KEPT_LIMIT = f"{MODULE_KEY}.worker-kept-limit"
WORKER_INSTRUCTION_FILES_SETTING = f"{MODULE_KEY}.worker-instruction-files"
DEFAULT_WORKER_COUNT = 2
SILENT_AGENT_MINUTES = f"{MODULE_KEY}.silent-agent-minutes"
IDLE_WORKER_MINUTES = f"{MODULE_KEY}.idle-worker-minutes"
IDLE_WORKER_REPEAT_MINUTES = f"{MODULE_KEY}.idle-worker-repeat-minutes"
MERGER_GROUP_MESSAGE_LIMIT = f"{MODULE_KEY}.most-merger-messages-per-group"
PHASE_TEST_DEFERRAL_LIMIT = f"{MODULE_KEY}.most-phase-test-deferrals"
MOST_OPEN_TASKS = f"{MODULE_KEY}.most-open-tasks"
STRONGEST_MODEL_LEAST_COMPLEXITY = f"{MODULE_KEY}.strongest-model-least-complexity"
SILENT_RECOVERY_ATTEMPTS = f"{MODULE_KEY}.silent-recovery-attempts"
WORKER_RESUME_LIMIT = f"{MODULE_KEY}.worker-resume-limit"
INACTIVE_HELPER_MINUTES = f"{MODULE_KEY}.quiet-helper-minutes"
INACTIVE_HELPER_GRACE_MINUTES = f"{MODULE_KEY}.quiet-helper-grace-minutes"
WORKER_BATCH_SIZE = f"{MODULE_KEY}.worker-batch-size"
WORKER_IDLE_HOURS = f"{MODULE_KEY}.worker-idle-hours"
WORKER_PHASE_TEST_RUNS = f"{MODULE_KEY}.worker-phase-test-runs"
WORKER_RUN_WAIT = f"{MODULE_KEY}.worker-run-wait-seconds"
MOST_RUN_WAIT_SECONDS = 100
MERGER_ENABLED = f"{MODULE_KEY}.merger-on"
MERGER_WAIT_MINUTES = f"{MODULE_KEY}.merger-wait-minutes"
UNSTARTED_WORKER_SECONDS = f"{MODULE_KEY}.unstarted-worker-seconds"
STOPPED_WORKER_RUN_MINUTES = f"{MODULE_KEY}.stopped-worker-run-minutes"
HUNG_PROOF_RUN_MINUTES = f"{MODULE_KEY}.stuck-proof-run-minutes"
MERGER_COMMANDS = f"{MODULE_KEY}.merger-commands"
DELIVERY_FAILURE_LIMIT = f"{MODULE_KEY}.hand-in-failures-to-flag"
WORKER_RUN_FAILURE_LIMIT = f"{MODULE_KEY}.own-test-failures-to-flag"
AFFECTED_TESTS_COMMAND = f"{MODULE_KEY}.affected-tests-command"
PROJECT_TEST_COMMAND = f"{MODULE_KEY}.project-test-command"
MAIN_MERGES_WORKERS = f"{MODULE_KEY}.main-agent-may-merge"
RESUME_SILENT_AGENTS = f"{MODULE_KEY}.resume-silent-agents"
WORKERS_START_HELPERS = f"{MODULE_KEY}.workers-start-read-only-helpers"
WORKER_SANDBOX = f"{MODULE_KEY}.worker-sandbox"
PROTECTED_FOLDERS = f"{MODULE_KEY}.protected-folders"
WORKTREE_UPDATES = f"{MODULE_KEY}.keep-worktrees-up-to-date"
STALE_CHECK_COMMITS = f"{MODULE_KEY}.behind-commits-to-check"
STALE_CHECK_MINUTES = f"{MODULE_KEY}.behind-check-minutes"
STALE_RECHECK_COMMITS = f"{MODULE_KEY}.behind-recheck-commits"
MAIN_UPDATE_COMMITS = f"{MODULE_KEY}.update-to-main-commits"
UPDATE_WAIT_MINUTES = f"{MODULE_KEY}.update-wait-minutes"
UPDATE_REMINDERS = f"{MODULE_KEY}.update-reminders"
CHECK_HISTORY_DAYS = f"{MODULE_KEY}.check-history-days"
WORKTREE_UPDATES_SECTION = "Keeping worktrees up to date"
WORKER_SETTING_VALUES = [
    SettingValue("idle-worker-minutes", "Worker idle warning", "Minutes without activity before a worker with work left is reported.", SettingType.NUMBER, default=15, person_set=True, required_settings=[MERGER_ENABLED], screen="helper-type.workers", section="How a worker works"),
    SettingValue("most-phase-test-deferrals", "Deferrals of one checkpoint test", "How often a merger may leave failing test paths out of the test of one checkpoint until the next checkpoint.", SettingType.NUMBER, default=2, person_set=True, required_settings=[MERGER_ENABLED], screen="tests", section="Telling the main agent"),
    SettingValue("most-merger-messages-per-group", "Questions and advice between two commits", "Questions a worker asks and advice it is given between two of its commits. A further question goes on to the next level.", SettingType.NUMBER, default=5, person_set=True, required_settings=[MERGER_ENABLED], screen="helper-type.merger", section="Questions"),
    SettingValue("silent-recovery-attempts", "Wake-up lines for a silent agent", "How many wake-up lines a silent agent gets before it is reported as not answering.", SettingType.NUMBER, default=3, person_set=True, screen="advanced", section="Silent agents"),
    SettingValue("worker-resume-limit", "Go-on lines for a stopped worker", "How often a stopped worker with tasks left is told to go on, with no task moved, before it is reported.", SettingType.NUMBER, default=3, person_set=True, screen="advanced", section="Silent agents"),
    SettingValue("idle-worker-repeat-minutes", "Worker idle warning repeat", "Minutes between warnings about a worker with work left.", SettingType.NUMBER, default=5, person_set=True, screen="advanced", section="Quiet helpers"),
    SettingValue("most-open-tasks", "Tasks a worker may hold started at once", "Most tasks a worker may have started before it commits some of them.", SettingType.NUMBER, default=5, person_set=True, screen="helper-type.workers", section="How a worker works"),
    SettingValue("strongest-model-least-complexity", "Least complexity for the strongest model", "Tasks sent alone, not as a plan or phase, to the strongest model are refused below this complexity; agents may skip it.", SettingType.NUMBER, default=3, person_set=True, screen="helper-type.workers", section="How a worker works"),
    SettingValue("worker-phase-test-runs", "A worker's test runs between two commits", "Test commands a worker may run itself between two commits before it asks the main agent.", SettingType.NUMBER, default=3, person_set=True, screen="tests", section="A worker's own runs"),
    SettingValue("silent-agent-minutes", "Silent agent minutes", "Minutes without tool use or a running command before an agent with unfinished work is resumed.", SettingType.NUMBER, default=3, person_set=True, screen="advanced", section="Silent agents"),
    SettingValue("affected-tests-command", "Affected tests command", "Find tests for changed files, one argument per line. Set the project test command too.", SettingType.TEXT, default="", person_set=True, screen="tests", section="Test commands"),
    SettingValue("project-test-command", "Project test command", "Run selected test arguments. Set the affected tests command too.", SettingType.TEXT, default="", person_set=True, screen="tests", section="Test commands"),
    SettingValue("worker-run-most-tests", "Test limit per worker command", "A worker command or proof test running more tests than this is refused or stopped. 0 means no limit.", SettingType.NUMBER, default=25, person_set=True, screen="tests", section="A worker's own runs"),
    SettingValue("worker-run-wait-seconds", "Seconds a helper waits for a test run", "Seconds a helper waits for a test or build, queued or running, before it gets the output number. At 0 none.", SettingType.NUMBER, default=60, person_set=True, screen="tests", section="A worker's own runs"),
    SettingValue("hand-in-failures-to-flag", "Failed commits to flag", "Failed commits of a task after which the main agent must read a line about it.", SettingType.NUMBER, default=3, person_set=True, screen="tests", section="Telling the main agent"),
    SettingValue("own-test-failures-to-flag", "Failed own tests to flag", "Failures of one test file in a worker's own runs after which the main agent must read a line about it.", SettingType.NUMBER, default=5, person_set=True, screen="tests", section="Telling the main agent"),
    SettingValue("merger-on", "Merger takes in workers", "A helper merges workers whose tests passed, and passes on what the main agent must judge.", SettingType.FLAG, default=True, person_set=True, required_settings=[DISPATCHES_WORKERS_SETTING], screen="work", section="Workers"),
    SettingValue("unstarted-worker-seconds", "Seconds before an unstarted worker", "Seconds after a worker is dispatched with no sign of its program before its main agent is told.", SettingType.NUMBER, default=60, person_set=True, screen="advanced", section="Silent agents"),
    SettingValue("stuck-proof-run-minutes", "Minutes before a proof run is stuck", "Minutes a proof's test run may go on before it is ended as failed and the worker and merger are told.", SettingType.NUMBER, default=30, person_set=True, screen="advanced", section="Silent agents"),
    SettingValue("stopped-worker-run-minutes", "Minutes before a stopped worker's run", "Minutes after a worker stopped with tasks left, while a command it started still runs, before its main agent is told.", SettingType.NUMBER, default=30, person_set=True, screen="advanced", section="Silent agents"),
    SettingValue("merger-wait-minutes", "Merger wait minutes", "Minutes the merger has to take in a worker whose tests passed, before the main agent is told to merge it.", SettingType.NUMBER, default=15, person_set=True, screen="helper-type.merger", section="Waiting"),
    SettingValue("merger-commands", "Merger commands", "Lines the merger runs after each merge, sending what they find to the worker. {commit} is the commit before it.", SettingType.LIST, default=(), person_set=True, required_settings=[MERGER_ENABLED], screen="helper-type.merger", section="Commands"),
    SettingValue("keep-worktrees-up-to-date", "Keep worktrees up to date", "Check whether a worker's working folder has fallen behind the branch it was cut from, and have it brought up to date.", SettingType.FLAG, default=True, person_set=True, screen="work", section=WORKTREE_UPDATES_SECTION),
    SettingValue("behind-commits-to-check", "Commits behind before a check", "New commits on the branch a worker was cut from before its folder is looked at. At 0 no folder is looked at.", SettingType.NUMBER, default=3, person_set=True, required_settings=[WORKTREE_UPDATES], screen="work", section=WORKTREE_UPDATES_SECTION),
    SettingValue("behind-check-minutes", "Minutes between checks", "Minutes between two looks at how far the workers' folders are behind their branch.", SettingType.NUMBER, default=10, person_set=True, required_settings=[WORKTREE_UPDATES], screen="work", section=WORKTREE_UPDATES_SECTION),
    SettingValue("behind-recheck-commits", "Commits before a folder is checked again", "How many more commits a folder left alone may fall behind before it is looked at again.", SettingType.NUMBER, default=3, person_set=True, required_settings=[WORKTREE_UPDATES], screen="work", section=WORKTREE_UPDATES_SECTION),
    SettingValue("update-to-main-commits", "Commits behind that go to the main agent", "A folder this many commits behind goes straight to the main agent. At 0 the merger always judges first.", SettingType.NUMBER, default=0, person_set=True, required_settings=[WORKTREE_UPDATES], screen="work", section=WORKTREE_UPDATES_SECTION),
    SettingValue("update-wait-minutes", "Minutes a worker has to update", "Minutes a worker told to update its folder has before it is reminded.", SettingType.NUMBER, default=30, person_set=True, required_settings=[WORKTREE_UPDATES], screen="work", section=WORKTREE_UPDATES_SECTION),
    SettingValue("update-reminders", "Reminders to update", "How many times a worker is reminded to update its folder before the main agent is told.", SettingType.NUMBER, default=2, person_set=True, required_settings=[WORKTREE_UPDATES], screen="work", section=WORKTREE_UPDATES_SECTION),
    SettingValue("check-history-days", "Days a closed check is kept", "Days a finished look at a folder behind its branch is kept before it is removed.", SettingType.NUMBER, default=30, person_set=True, screen="work", section=WORKTREE_UPDATES_SECTION),
    SettingValue("main-dispatches-workers", "Main agent sends workers", "Whether the main agent may send workers to do tasks.", SettingType.FLAG, default=True, person_set=True, screen="work", section="Workers"),
    SettingValue("main-agent-may-merge", "Main agent may merge workers", "Whether the main agent may merge the work of a worker itself.", SettingType.FLAG, default=True, person_set=True, required_settings=[DISPATCHES_WORKERS_SETTING], screen="work", section="Workers"),
    SettingValue("resume-silent-agents", "Resume silent agents", "Whether a helper with unfinished work that has gone silent is resumed.", SettingType.FLAG, default=True, person_set=True, screen="advanced", section="Silent agents"),
    SettingValue("workers-start-read-only-helpers", "Workers may use read-only helpers", "Whether a worker may start read-only helpers for the task it works on.", SettingType.FLAG, default=True, person_set=True, screen="helper-type.workers", section="How a worker works"),
    SettingValue("worker-sandbox", "Worker sandbox", "Workers run their commands in a sandbox that lets them write only in the working folder of the worker.", SettingType.FLAG, default=True, person_set=True),
    SettingValue("protected-folders", "Protected folders", "Paths or globs workers may not change.", SettingType.LIST, default=(), person_set=True, requires_main_agent=True),
    SettingValue("worker-run-limit", "Workers running", "Workers that run at once in an environment. At 0 none run.", SettingType.NUMBER, default=DEFAULT_WORKER_COUNT, person_set=True, screen="helper-type.workers", section="How many"),
    SettingValue("worker-kept-limit", "Workers kept", "Workers kept, running or idle, until retired. At 0 there is no limit.", SettingType.NUMBER, default=8, person_set=True, screen="helper-type.workers", section="How many"),
    SettingValue("worker-instruction-files", "Instruction files for a worker's profile", "A worker's worktree gets CLAUDE.md and AGENTS.md written for its profile, not the project's copies.", SettingType.FLAG, default=True, scope=SettingScope.PROJECT),
    SettingValue("worker-idle-hours", "Worker idle hours", "Hours without tool use before an unfinished worker's process stops. Its task and working folder stay.", SettingType.NUMBER, default=6, person_set=True, screen="helper-type.workers", section="How a worker works"),
    SettingValue("worker-batch-size", "Tasks handed to a worker at once", "Recommended tasks per worker assignment. The main agent is prompted to add more when fewer are assigned.", SettingType.NUMBER, default=3, person_set=True, screen="helper-type.workers", section="How a worker works"),
    SettingValue("quiet-helper-grace-minutes", "Quiet helper grace minutes", "Minutes without tool use, or with work that has not started, before the main agent first hears of a helper.", SettingType.NUMBER, default=15, person_set=True, screen="advanced", section="Quiet helpers"),
    SettingValue("quiet-helper-minutes", "Quiet helper minutes", "Minutes between the reminders to the main agent, until the helper is stopped or back at work.", SettingType.NUMBER, default=5, person_set=True, screen="advanced", section="Quiet helpers"),
    SettingValue("library-links", "Library links", "Folders each worker's worktree links from the main checkout.", SettingType.LIST, default=()),
    SettingValue("library-copies", "Library copies", "Folders each worker's worktree gets a copy of.", SettingType.LIST, default=()),
    SettingValue("preset-test-commands", "Preset test commands", "Test commands each worker gets, as name=command; a name replaces the one found in the project's manifests.",
                 SettingType.LIST, default=(), person_set=True),
    SettingValue(WORKTREE_COMMANDS_NAME, "Worktree commands", "Commands run in each new worker worktree before the worker starts.",
                 SettingType.LIST, default=()),
    SettingValue(MERGE_COMMANDS_NAME, "Merge commands", "Commands run in the main checkout after each worker merge, such as a push. The task closes only when they all succeed.",
                 SettingType.LIST, default=(), person_set=True),
    SettingValue("merge-built-paths", "Built files a merge rebuilds", "Globs of files a build makes. A merge never stops on a clash in them; it builds them again from the merged sources.",
                 SettingType.LIST, default=("**/web/dist/**", "src/core/modules/viewer/web/dist/**"), person_set=True, screen="helper-type.workers", section="Merging"),
    SettingValue("merge-build-command", "Build command after a merge", "The command that builds the built files again after a merge, run in the checkout that was merged into.",
                 SettingType.TEXT, default="npm --prefix src/viewer run build", person_set=True, screen="helper-type.workers", section="Merging"),
    SettingValue(MERGE_HOOKS_NAME, "Commands after a merge, per profile", "Entries of profile: command, run in the main checkout after a worker of that profile is merged.",
                 SettingType.LIST, default=(), person_set=True, screen=HELPER_TYPES_SCREEN, section="When merged"),
    SettingValue(OVERSIGHT_PROFILES_NAME, "Profiles that oversee workers", "Helper profiles whose agents may read any worker's logs and the merges waiting, without marking them read.",
                 SettingType.LIST, default=(), person_set=True),
]
WORKER_SETTING_RULES = {WORKER_RUN_LIMIT: NumberRule(0),
                        WORKER_KEPT_LIMIT: NumberRule(0),
                        WORKER_BATCH_SIZE: NumberRule(1),
                        SILENT_AGENT_MINUTES: NumberRule(1),
                        WORKER_IDLE_HOURS: NumberRule(0, integer=False, exclusive=True),
                        IDLE_WORKER_MINUTES: NumberRule(1),
                        IDLE_WORKER_REPEAT_MINUTES: NumberRule(1),
                        ASK_ANSWER_MINUTES: NumberRule(1),
                        ASK_PASS_ON_MINUTES: NumberRule(1),
                        ASK_VISITS_LIMIT: NumberRule(1),
                        MERGER_GROUP_MESSAGE_LIMIT: NumberRule(1),
                        PHASE_TEST_DEFERRAL_LIMIT: NumberRule(1),
                        MOST_OPEN_TASKS: NumberRule(1),
                        SILENT_RECOVERY_ATTEMPTS: NumberRule(1),
                        WORKER_RESUME_LIMIT: NumberRule(0),
                        INACTIVE_HELPER_GRACE_MINUTES: NumberRule(1),
                        INACTIVE_HELPER_MINUTES: NumberRule(1),
                        WORKER_PHASE_TEST_RUNS: NumberRule(0),
                        WORKER_TEST_LIMIT: NumberRule(0),
                        WORKER_RUN_WAIT: NumberRule(0, maximum=MOST_RUN_WAIT_SECONDS),
                        DELIVERY_FAILURE_LIMIT: NumberRule(1),
                        WORKER_RUN_FAILURE_LIMIT: NumberRule(1),
                        MERGER_WAIT_MINUTES: NumberRule(1),
                        UNSTARTED_WORKER_SECONDS: NumberRule(1),
                        STOPPED_WORKER_RUN_MINUTES: NumberRule(1),
                        HUNG_PROOF_RUN_MINUTES: NumberRule(1),
                        STALE_CHECK_COMMITS: NumberRule(0),
                        STALE_CHECK_MINUTES: NumberRule(1),
                        STALE_RECHECK_COMMITS: NumberRule(0),
                        MAIN_UPDATE_COMMITS: NumberRule(0),
                        UPDATE_WAIT_MINUTES: NumberRule(1),
                        UPDATE_REMINDERS: NumberRule(0),
                        CHECK_HISTORY_DAYS: NumberRule(1),
                        MERGER_COMMANDS: ListRule(),
                        PROTECTED_FOLDERS: ListRule(),
                        MERGE_COMMANDS: ListRule(), MERGE_HOOKS: ListRule(), OVERSIGHT_PROFILES: ListRule()}
WORKER_SETTINGS = ruled_settings(MODULE_KEY, WORKER_SETTING_VALUES, WORKER_SETTING_RULES)
TEST_COMMAND_PAIR = CommandPairRule(AFFECTED_TESTS_COMMAND, PROJECT_TEST_COMMAND)
TEST_LIMIT_SECONDS = 3600
