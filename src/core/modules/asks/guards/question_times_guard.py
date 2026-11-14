import json

from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.event.created import Created
from engine.event.updated import Updated
from engine.guard.guard import Guard
from engine.setting.setting_values import SettingValues
from core.modules.settings.models.setting import Setting
from core.modules.asks.support.ask_settings import ASK_ANSWER_MINUTES, ASK_PASS_ON_MINUTES


class QuestionTimesGuard(Guard[Created[Setting] | Updated[Setting]]):
    """The time after which a question goes on to the next level is never set below the time a level has to answer
    it."""

    name = "asks.question-times"

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def check(self, event: Created[Setting] | Updated[Setting], context: Context) -> None:
        if event.row.key not in (ASK_ANSWER_MINUTES, ASK_PASS_ON_MINUTES):
            return
        minutes = json.loads(event.row.value)
        answer_minutes = minutes if event.row.key == ASK_ANSWER_MINUTES else self.settings.number(ASK_ANSWER_MINUTES)
        forward_minutes = minutes if event.row.key == ASK_PASS_ON_MINUTES else self.settings.number(ASK_PASS_ON_MINUTES)
        if forward_minutes < answer_minutes:
            raise Refusal(f"a question goes on after {forward_minutes} minutes, before the {answer_minutes} minutes a level has to answer it",
                          "set ask-pass-on-minutes to at least ask-answer-minutes")
