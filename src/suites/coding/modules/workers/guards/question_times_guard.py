import json

from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.event.created import Created
from engine.event.updated import Updated
from engine.guard.guard import Guard
from engine.setting.setting_values import SettingValues
from core.modules.settings.models.setting import Setting
from suites.coding.modules.workers.support.worker_settings import QUESTION_ANSWER_MINUTES, QUESTION_FORWARD_MINUTES


class QuestionTimesGuard(Guard[Created[Setting] | Updated[Setting]]):
    """The time after which a worker's question goes to the main agent is never set below the time the merger
    has to answer it."""

    name = "workers.question-times"

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def check(self, event: Created[Setting] | Updated[Setting], context: Context) -> None:
        if event.row.key not in (QUESTION_ANSWER_MINUTES, QUESTION_FORWARD_MINUTES):
            return
        minutes = json.loads(event.row.value)
        answer_minutes = minutes if event.row.key == QUESTION_ANSWER_MINUTES else self.settings.number(QUESTION_ANSWER_MINUTES)
        forward_minutes = minutes if event.row.key == QUESTION_FORWARD_MINUTES else self.settings.number(QUESTION_FORWARD_MINUTES)
        if forward_minutes < answer_minutes:
            raise Refusal(f"a question goes to the main agent after {forward_minutes} minutes, before the {answer_minutes} minutes the merger has to answer it",
                          "set ask-pass-on-minutes to at least ask-answer-minutes")
