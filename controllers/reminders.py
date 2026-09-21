from controllers.base import Controller
from resources import types


class Reminders(Controller):
    resource = types.Reminder

    def create(self, title: str, abstract: str = "", brief: str = "", until: str = "", **data):
        return super().create(title, abstract, brief, until=until, **data)
