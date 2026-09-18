from v2.controllers.base import Controller
from v2.resources import types


class Messages(Controller):
    resource = types.Message


class Todos(Controller):
    resource = types.Todo


class Works(Controller):
    resource = types.Work


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


class Suggestions(Controller):
    resource = types.Suggestion


class Comments(Controller):
    resource = types.Comment


class Agents(Controller):
    resource = types.AgentRow

    def by_session(self, session: str):
        for r in self.all():
            if r.title == session:
                return r
        return self.create(session, status="stopped")


CONTROLLERS = {c.resource.type: c for c in (Messages, Todos, Works, Plans, Docs, Reports, Pins, Rules, Reminders,
                                            Questions, Suggestions, Comments, Agents)}
