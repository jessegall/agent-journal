from controllers.base import Controller
from resources import types


class Questions(Controller):
    resource = types.Question

    def complete(self, n: int, how: str = "", **data):
        return super().complete(n, how=how, **{**data, "kept": False})
