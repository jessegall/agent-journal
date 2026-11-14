from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.asks"
ASK_ANSWER_MINUTES = f"{MODULE_KEY}.ask-answer-minutes"
ASK_PASS_ON_MINUTES = f"{MODULE_KEY}.ask-pass-on-minutes"
ASK_VISITS_LIMIT = f"{MODULE_KEY}.ask-visits-limit"
ASKS_SCREEN = "helper-type.asks"
QUESTIONS_SECTION = "Questions"
ASK_SETTINGS = [
    SettingValue("ask-answer-minutes", "Answer time for a question", "Minutes the helper at a level has to answer a question before it is reminded of it.", SettingType.NUMBER, default=10, person_set=True, screen=ASKS_SCREEN, section=QUESTIONS_SECTION),
    SettingValue("ask-pass-on-minutes", "Minutes before a question is passed on", "Minutes after which a question nobody answered at a level goes on to the next one.", SettingType.NUMBER, default=30, person_set=True, screen=ASKS_SCREEN, section=QUESTIONS_SECTION),
    SettingValue("ask-visits-limit", "Readings of a question", "How many times the helper at a level reads a question without answering before it goes on to the next one.", SettingType.NUMBER, default=2, person_set=True, screen=ASKS_SCREEN, section=QUESTIONS_SECTION),
]
