from engine.setting.setting_group import SettingGroup
from engine.enums.setting_scope import SettingScope
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.drivers"
SUITE_SETTING = f"{MODULE_KEY}.suite"
EVENT_COUNT_SETTING = f"{MODULE_KEY}.event-count"
DRIVER_SETTINGS = f"{MODULE_KEY}.driver."
HOOK_WAIT_SECONDS = f"{MODULE_KEY}.hook-wait-seconds"
BLOCK_CARD_SECONDS = f"{MODULE_KEY}.block-card-seconds"
HANDOVER_RETRIES_SETTING = f"{MODULE_KEY}.handover-retries"
CAPABILITY_PROOFS_SETTING = f"{MODULE_KEY}.capability-proofs"
RETRY_RESERVE_SETTING = f"{MODULE_KEY}.retry-reserve-ms"
STEP_ROUND_AGENTS_SETTING = f"{MODULE_KEY}.step-round-agents"
WAKE_RETRY_SETTING = f"{MODULE_KEY}.wake-retry-seconds"
WAKE_ATTEMPTS_SETTING = f"{MODULE_KEY}.wake-attempts"
DRIVERS_SETTINGS = [
    SettingValue("suite", "Suite", "The set of agent roles and workflows available in this environment.", SettingType.TEXT, default="", scope=SettingScope.ENVIRONMENT, person_set=True,
                 is_driving=True),
    SettingValue("hook-wait-seconds", "Tool call wait", "Seconds to wait for the journal before allowing a tool call without checks.", SettingType.NUMBER, default=5, scope=SettingScope.PROJECT),
    SettingValue("block-card-seconds", "Hold before Blocked", "Seconds the journal holds an agent before its card shows Blocked, unless its task is blocked.", SettingType.NUMBER, default=120,
                 scope=SettingScope.PROJECT),
    SettingValue("event-count", "Activity history kept", "How many of the newest changes the journal keeps in its history. Older ones are deleted.", SettingType.NUMBER, default=10000,
                 scope=SettingScope.PROJECT),
    SettingGroup("driver", "Drivers", "The driver each type of agent works under in this environment.",
                 any_key=SettingValue("*", "Driver", "The driver this type of agent works under.", SettingType.TEXT, default="", scope=SettingScope.ENVIRONMENT, person_set=True,
                                      is_driving=True)),
    SettingValue("most-stop-refusals", "Refused stops before asking", "How many stops of an agent may be refused one after another before its parent or a user is asked.",
                 SettingType.NUMBER, default=5, scope=SettingScope.PROJECT, is_driving=True),
    SettingValue("most-tool-refusals", "Refused tool calls before asking", "How many tool calls a block may refuse one after another before the agent's parent or a user is asked.",
                 SettingType.NUMBER, default=25, scope=SettingScope.PROJECT, is_driving=True),
    SettingValue("step-round-agents", "Agents stepped per round", "How many agents the journal steps in one round after a change.", SettingType.NUMBER, default=20,
                 scope=SettingScope.PROJECT),
    SettingValue("wake-retry-seconds", "Wake retry", "Seconds after which a wake that no turn acknowledged is tried again.", SettingType.NUMBER, default=60,
                 scope=SettingScope.PROJECT),
    SettingValue("wake-attempts", "Wake attempts", "How many times a wake is tried before its responder is told.", SettingType.NUMBER, default=3, scope=SettingScope.PROJECT),
    SettingValue("retry-reserve-ms", "Time kept for a second check", "Milliseconds the answer to an agent event must still have left before a lost check is tried again.",
                 SettingType.NUMBER, default=1000, scope=SettingScope.PROJECT),
    SettingValue("handover-retries", "Handover retries", "How many times a helper's report that could not be saved is tried again.", SettingType.NUMBER,
                 default=3, scope=SettingScope.PROJECT),
    SettingValue("capability-proofs", "Program capability proofs", "The proofs that an installed agent program supports a part of the journal's answer.",
                 SettingType.LIST, default=(), scope=SettingScope.PROJECT, person_set=True, is_driving=True),
]
SKIP_APPROVAL_SETTING = "journal.core.helpers.skips-need-approval"
AUTOMATIC_APPROVAL = "journal.core.helpers.accept-every-approval"
