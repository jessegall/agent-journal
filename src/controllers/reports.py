from controllers.base import Controller
from resources import types
from controllers.docs import Docs


class Reports(Controller):
    resource = types.Report

    def doc(self, n: int):
        return self._carried(n, Docs(self.record, actor=self.actor), "became")
