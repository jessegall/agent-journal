from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.chat"
EXCEPTION_MARK_SECONDS = f"{MODULE_KEY}.exception-mark-seconds"
CHAT_SETTINGS = [
    SettingValue("exception-mark-seconds", "Seconds an error stays news", "An error that is older than this many seconds when the chat reaches it is not shown.", SettingType.NUMBER, default=60),
]
