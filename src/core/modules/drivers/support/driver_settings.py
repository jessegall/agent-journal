from engine.setting.setting_group import SettingGroup
from engine.enums.setting_scope import SettingScope
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.drivers"
SUITE_SETTING = f"{MODULE_KEY}.suite"
DAYS_SETTING = f"{MODULE_KEY}.hook-call-days"
EVENT_COUNT_SETTING = f"{MODULE_KEY}.event-count"
DRIVER_SETTINGS = f"{MODULE_KEY}.driver."
HOOK_WAIT_SECONDS = f"{MODULE_KEY}.hook-wait-seconds"
BLOCK_CARD_SECONDS = f"{MODULE_KEY}.block-card-seconds"
ALLOWANCE_SETTINGS = f"{MODULE_KEY}.essential."
DRIVERS_SETTINGS = [
    SettingValue("suite", "Suite", "The set of agent roles and workflows available in this environment.", SettingType.TEXT, default="", scope=SettingScope.ENVIRONMENT, person_set=True),
    SettingValue("hook-wait-seconds", "Tool call wait", "Seconds to wait for the journal before allowing a tool call without checks.", SettingType.NUMBER, default=5, scope=SettingScope.PROJECT),
    SettingValue("block-card-seconds", "Hold before Blocked", "Seconds the journal holds an agent before its card shows Blocked, unless its task is blocked.", SettingType.NUMBER, default=120,
                 scope=SettingScope.PROJECT),
    SettingValue("hook-call-days", "Call record days", "How many days the journal keeps the record of each call from the agent program.", SettingType.NUMBER, default=3,
                 scope=SettingScope.PROJECT),
    SettingValue("event-count", "Activity history kept", "How many of the newest changes the journal keeps in its history. Older ones are deleted.", SettingType.NUMBER, default=10000,
                 scope=SettingScope.PROJECT),
    SettingGroup("driver", "Drivers", "The driver each type of agent works under in this environment.",
                 any_key=SettingValue("*", "Driver", "The driver this type of agent works under.", SettingType.TEXT, default="", scope=SettingScope.ENVIRONMENT, person_set=True)),
    SettingGroup("essential", "Essential rules", "Essential rules the user allowed to be switched off.",
                 any_key=SettingValue("*", "Allowed", "Whether this essential rule may be switched off.", SettingType.FLAG, default=False, scope=SettingScope.PROJECT, person_set=True)),
]
SKIPS_NEED_APPROVAL = "journal.core.helpers.skips-need-approval"
AUTOMATIC_APPROVAL = "journal.core.helpers.accept-every-approval"
