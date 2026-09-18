from v2.controllers.base import Controller
from v2.resources import types


class Messages(Controller):
    resource = types.Message

    def process(self, n: int, became: list[str]):
        return self.update(n, processed=True, became=became)


class Todos(Controller):
    resource = types.Todo

    def done(self, n: int, how: str = ""):
        return self.update(n, status="done", how=how)


class Works(Controller):
    resource = types.Work

    def end(self, n: int, note: str = ""):
        return self.update(n, status="ended", note=note)


class Plans(Controller):
    resource = types.Plan


class Docs(Controller):
    resource = types.Doc


class Reports(Controller):
    resource = types.Report


class Pins(Controller):
    resource = types.Pin


class Rules(Controller):
    resource = types.Rule


class Reminders(Controller):
    resource = types.Reminder


class Questions(Controller):
    resource = types.Question

    def answer(self, n: int, answer: str):
        return self.update(n, answer=answer, status="answered")


class Suggestions(Controller):
    resource = types.Suggestion


class Comments(Controller):
    resource = types.Comment


CONTROLLERS = {c.resource.type: c for c in (Messages, Todos, Works, Plans, Docs, Reports, Pins, Rules, Reminders,
                                            Questions, Suggestions, Comments)}
