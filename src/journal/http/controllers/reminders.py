from journal.http.controllers.controller import Controller
from journal.models.reminder import Reminder
from journal.repositories.reminders import Reminders


class ReminderController(Controller[Reminder]):
    """What the agent is to bring up again."""

    def __init__(self, reminders: Reminders) -> None:
        self.repository = reminders
