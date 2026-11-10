from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.messages"
TRANSCRIPT_WAIT_SECONDS = f"{MODULE_KEY}.transcript-wait-seconds"
TRANSCRIPT_LOOKBACK_SECONDS = f"{MODULE_KEY}.transcript-lookback-seconds"
TRANSCRIPT_OLDEST_MINUTES = f"{MODULE_KEY}.transcript-oldest-minutes"
MESSAGE_SETTINGS = [
    SettingValue("transcript-wait-seconds", "Seconds before a line is checked", "Seconds a line of an agent's transcript waits before the journal checks that it reached the chat.", SettingType.NUMBER, default=15),
    SettingValue("transcript-lookback-seconds", "Seconds of transcript looked back over", "How far back from a line the journal looks for the same text already shown in the chat.", SettingType.NUMBER, default=60),
    SettingValue("transcript-oldest-minutes", "Oldest transcript line shown", "Lines of an agent's transcript older than this many minutes are never added to the chat.", SettingType.NUMBER, default=60),
]
