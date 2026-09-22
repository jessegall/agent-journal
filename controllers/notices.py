from controllers.base import Controller
from resources import types


class Notices(Controller):
    resource = types.Notice

    def complete(self, n: int, how: str = "", **data):
        found = self.load(n)
        return found if found.completed else super().complete(n, how=how, **data)
