from core.base.setting.ruled_settings import ruled_settings
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
from core.base.setting.list_rule import ListRule
from core.base.setting.number_rule import NumberRule

MODULE_KEY = "journal.core.helpers"
HELPER_RUN_LIMIT = f"{MODULE_KEY}.helper-run-limit"
HELPER_KEPT_LIMIT = f"{MODULE_KEY}.helper-kept-limit"
HELPER_PROFILE_LIMITS = f"{MODULE_KEY}.helper-profile-limits"
ALLOWED_MODELS = f"{MODULE_KEY}.allowed-models"
HELPER_MAX_MINUTES = f"{MODULE_KEY}.helper-max-minutes"
HELPER_MAX_COST = f"{MODULE_KEY}.helper-max-cost"
AGENT_USE_DAYS = "journal.core.helpers.agent-use-days"
PROGRAM_WINDOW_PERCENT = f"{MODULE_KEY}.program-window-percent"
PROGRAM_SPLIT = f"{MODULE_KEY}.program-split"
AGENT_OPTIONS = f"{MODULE_KEY}.agent-options"
HELPER_SETTING_VALUES = [SettingValue("agent-use-days", "Days of agent use counted", "Days of jobs counted when suggesting which kept agent to retire.", SettingType.NUMBER, default=14),
                   SettingValue("helper-run-limit", "Helpers running, per profile", "Helpers of each profile that run at once; six profiles at 4 make 24. At 0 none run.", SettingType.NUMBER, default=4, person_set=True),
                   SettingValue("helper-kept-limit", "Helpers kept, per profile", "Helpers kept of each profile, running or idle, until retired. At 0 there is no limit.", SettingType.NUMBER, default=8, person_set=True),
                   SettingValue("helper-profile-limits", "Limits for one profile", "Entries of profile:run:kept, each winning for its profile. An environment list replaces the project list.", SettingType.LIST, default=(), person_set=True),
                   SettingValue("allowed-models", "Allowed models", "Models that agents may run, as program and model; empty allows all.", SettingType.LIST, default=(), person_set=True),
                   SettingValue("helper-max-minutes", "Longest helper job", "Minutes a helper may work on one job before it is stopped.", SettingType.NUMBER, default=60, person_set=True),
                   SettingValue("helper-max-cost", "Largest helper cost", "Dollars a helper may cost before it is stopped; 0 sets no limit.", SettingType.NUMBER, default=0, person_set=True),
                   SettingValue("program-window-percent", "Plan allowance used", "Stop assigning new agents when a plan window reaches this percent; 0 turns this check off.", SettingType.NUMBER, default=95, person_set=True),
                   SettingValue("program-split", "Program split", "Percentage of new work for each program. Task routes take priority.", SettingType.LIST, default=(), person_set=True),
                   SettingValue("agent-options", "Agent options", "Options of workers and helpers, a line each, such as worker allow_new=off or helper:researcher max_cost=2.", SettingType.LIST, default=(), person_set=True)]
HELPER_SETTING_RULES = {HELPER_RUN_LIMIT: NumberRule(0),
                        HELPER_KEPT_LIMIT: NumberRule(0),
                        HELPER_PROFILE_LIMITS: ListRule(pattern=r"[\w.-]+:\d+:\d+"),
                        ALLOWED_MODELS: ListRule(pattern=r"\S+ \S+"),
                        HELPER_MAX_MINUTES: NumberRule(0),
                        HELPER_MAX_COST: NumberRule(0, integer=False),
                        PROGRAM_WINDOW_PERCENT: NumberRule(0, maximum=100),
                        PROGRAM_SPLIT: ListRule(pattern=r"\S+ \d+", total=100)}
HELPER_SETTINGS = ruled_settings(MODULE_KEY, HELPER_SETTING_VALUES, HELPER_SETTING_RULES)
