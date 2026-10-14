from controllers.base import Controller
from resources import types
from resources.base import USER


class Notifications(Controller):
    resource = types.Notification

    def _logged(self, title: str, brief: str = "", **data):
        made = self.create(title, brief=brief, **data)
        return Notifications(self.record, actor=USER).read(made.n)
