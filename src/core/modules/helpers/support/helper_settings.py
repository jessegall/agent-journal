from engine.setting.ruled_settings import ruled_settings
from engine.enums.setting_component import SettingComponent
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue
from engine.setting.list_rule import ListRule
from engine.setting.number_rule import NumberRule

from core.modules.settings.bindings.support.context_share import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_KINDS, CONTEXT_LIMIT_PROFILES, CONTEXT_LIMIT_TOKENS

MODULE_KEY = "journal.core.helpers"
HELPER_RUN_LIMIT = f"{MODULE_KEY}.read-only-helper-run-limit"
HELPER_KEPT_LIMIT = f"{MODULE_KEY}.read-only-helper-kept-limit"
HELPER_PROFILE_LIMITS = f"{MODULE_KEY}.read-only-helper-profile-limits"
ALLOWED_MODELS = f"{MODULE_KEY}.allowed-models"
HELPER_MAX_MINUTES = f"{MODULE_KEY}.read-only-helper-max-minutes"
HELPER_MAX_COST = f"{MODULE_KEY}.read-only-helper-max-cost"
AGENT_USE_DAYS = "journal.core.helpers.agent-use-days"
PROGRAM_WINDOW_PERCENT = f"{MODULE_KEY}.program-window-percent"
PROGRAM_SPLIT = f"{MODULE_KEY}.program-split"
AGENT_OPTIONS = f"{MODULE_KEY}.agent-options"
HELPER_INSTRUCTION_FILES = f"{MODULE_KEY}.read-only-helper-instruction-files"
COLD_SESSION_MINUTES = f"{MODULE_KEY}.cold-session-minutes"
UNSTARTED_HELPER_SECONDS = f"{MODULE_KEY}.unstarted-helper-seconds"
COLD_SESSION_CONTEXT_PERCENT = f"{MODULE_KEY}.cold-session-context-percent"
CONTEXT_LIMIT_FINISH_TASK = f"{MODULE_KEY}.context-limit-finish-task"
CONTEXT_LIMIT_HARD_TOKENS = f"{MODULE_KEY}.context-limit-hard-tokens"
CONTEXT_LIMIT_ACTION = f"{MODULE_KEY}.context-limit-action"
CONTEXT_LIMIT_GROWTH_PERCENT = f"{MODULE_KEY}.context-limit-growth-percent"
CONTEXT_ACTIONS = ("compact", "clear")
HELPER_SETTING_VALUES = [SettingValue("unstarted-helper-seconds", "Seconds before a helper counts as failed", "Seconds after a helper starts with no sign of its program before its launch counts as failed.", SettingType.NUMBER, default=60),
                   SettingValue("agent-use-days", "Days of agent use counted", "Days of jobs counted when suggesting which kept agent to retire.", SettingType.NUMBER, default=14),
                   SettingValue("read-only-helper-run-limit", "Read-only helpers running, per profile", "Read-only helpers of each profile that run at once; six profiles at 4 make 24. At 0 none run.", SettingType.NUMBER, default=4, person_set=True, screen="helper-type.read-only", section="Every profile"),
                   SettingValue("read-only-helper-kept-limit", "Read-only helpers kept, per profile", "Read-only helpers kept of each profile, running or idle, until retired. At 0 there is no limit.", SettingType.NUMBER, default=8, person_set=True, screen="helper-type.read-only", section="Every profile"),
                   SettingValue("read-only-helper-profile-limits", "Read-only helper limits for one profile", "Entries of profile:run:kept, each winning for its profile. An environment list replaces the project list.", SettingType.LIST, default=(), person_set=True, screen="helper-type.read-only", section="Every profile"),
                   SettingValue("allowed-models", "Allowed models", "Models that agents may run, as program and model; empty allows all.", SettingType.LIST, default=(), person_set=True),
                   SettingValue("read-only-helper-max-minutes", "Longest read-only helper job", "Minutes a read-only helper may work on one job before it is stopped.", SettingType.NUMBER, default=60, person_set=True, screen="helper-type.read-only", section="Every profile"),
                   SettingValue("read-only-helper-max-cost", "Largest read-only helper cost", "Dollars a read-only helper may cost before it is stopped; 0 sets no limit.", SettingType.NUMBER, default=0, person_set=True, screen="helper-type.read-only", section="Every profile"),
                   SettingValue("program-window-percent", "Plan allowance used", "Stop assigning new agents when a plan window reaches this percent; 0 turns this check off.", SettingType.NUMBER, default=95, person_set=True),
                   SettingValue("program-split", "Program split", "Percentage of new work for each program. Task routes take priority.", SettingType.LIST, default=(), person_set=True),
                   SettingValue("read-only-helper-instruction-files", "Read-only helper instruction files", "A read-only helper starts in a folder of links with instruction files written for its profile.", SettingType.FLAG, default=True, person_set=True),
                   SettingValue("cold-session-minutes", "Prompt cache lifetime", "Minutes after an agent's last reply that its prompt cache counts as gone. At 0 this check is off.", SettingType.NUMBER, default=55, person_set=True, screen="advanced", section="Prompt cache"),
                   SettingValue("cold-session-context-percent", "Context too large to resume cold", "A cold agent whose context fills this percent or more starts a new session. At 0 this check is off.", SettingType.NUMBER, default=20, person_set=True, screen="advanced", section="Prompt cache"),
                   SettingValue("context-limit-on", "Compact agents at a context size", "Compact an agent between its turns once its context reaches the size set here.", SettingType.FLAG, default=False, person_set=True, screen="advanced", section="Context size"),
                   SettingValue("context-limit-tokens", "Compact at this context size", "An agent with this many tokens in its context is compacted between turns.", SettingType.NUMBER, default=400000, person_set=True, required_settings=tuple([CONTEXT_LIMIT_ENABLED]), screen="advanced", section="Context size"),
                   SettingValue("context-limit-kinds", "Context size per type of agent", "Entries of type:tokens, such as worker:200000 or main:none (no cap). A type not listed uses the size above.", SettingType.LIST, default=(), person_set=True, required_settings=tuple([CONTEXT_LIMIT_ENABLED]), screen="advanced", section="Context size", component=SettingComponent.KEYED_CAP_TABLE),
                   SettingValue("context-limit-profiles", "Context size per helper type", "Entries of profile:tokens, such as journal-planner:150000, each winning over its type of agent.", SettingType.LIST, default=(), person_set=True, required_settings=tuple([CONTEXT_LIMIT_ENABLED]), screen="advanced", section="Context size", component=SettingComponent.THREE_WAY_CAP),
                   SettingValue("context-limit-finish-task", "Let it finish its task first", "An agent past the limit first finishes the task in hand, and is compacted when it ends.", SettingType.FLAG, default=True, person_set=True, required_settings=tuple([CONTEXT_LIMIT_ENABLED]), screen="advanced", section="Context size"),
                   SettingValue("context-limit-hard-tokens", "Compact anyway at this context size", "Past this many tokens an agent is compacted even with a task in hand.", SettingType.NUMBER, default=600000, person_set=True, required_settings=tuple([CONTEXT_LIMIT_ENABLED]), screen="advanced", section="Context size"),
                   SettingValue("context-limit-growth-percent", "Growth before compacting again", "After a compaction that left the context at or over the limit, it must grow by this percent of the limit first.", SettingType.NUMBER, default=10, person_set=True, required_settings=tuple([CONTEXT_LIMIT_ENABLED]), screen="advanced", section="Context size"),
                   SettingValue("context-limit-action", "At the context size", "Compact the context, or clear it and let the journal give back the open tasks and memories.", SettingType.CHOICE, default=CONTEXT_ACTIONS[0], choices=CONTEXT_ACTIONS, person_set=True, screen="advanced", section="Context size"),
                   SettingValue("accept-every-approval", "Accept every approval", "Every approval an agent asks for is accepted at once, as you. The chat still shows each one.", SettingType.FLAG, default=False, person_set=True, screen="work", section="Approvals"),
                   SettingValue("skips-need-approval", "Main agent approves skips", "A skip of a refusal by a helper passes only once its main agent approves it.", SettingType.FLAG, default=True, person_set=True, screen="work", section="Approvals"),
                   SettingValue("agent-options", "Agent options", "One option per line for each helper type, for example helper:researcher max_cost=2.", SettingType.LIST, default=(), person_set=True)]
HELPER_SETTING_RULES = {COLD_SESSION_MINUTES: NumberRule(0),
                        CONTEXT_LIMIT_TOKENS: NumberRule(0),
                        CONTEXT_LIMIT_HARD_TOKENS: NumberRule(0),
                        CONTEXT_LIMIT_GROWTH_PERCENT: NumberRule(0),
                        COLD_SESSION_CONTEXT_PERCENT: NumberRule(0),
                        HELPER_RUN_LIMIT: NumberRule(0),
                        HELPER_KEPT_LIMIT: NumberRule(0),
                        HELPER_PROFILE_LIMITS: ListRule(pattern=r"[\w.-]+:\d+:\d+"),
                        ALLOWED_MODELS: ListRule(pattern=r"\S+ \S+"),
                        HELPER_MAX_MINUTES: NumberRule(0),
                        HELPER_MAX_COST: NumberRule(0, integer=False),
                        PROGRAM_WINDOW_PERCENT: NumberRule(0, maximum=100),
                        PROGRAM_SPLIT: ListRule(pattern=r"\S+ \d+", total=100)}
HELPER_SETTINGS = ruled_settings(MODULE_KEY, HELPER_SETTING_VALUES, HELPER_SETTING_RULES)
