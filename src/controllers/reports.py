from controllers.base import Controller
from resources import types
from resources.base import SECTION
from controllers.docs import Docs


class Reports(Controller):
    resource = types.Report

    def doc(self, n: int):
        r = self.load(n)
        docs = Docs(self.record, actor=self.actor)
        made = docs.create(r.title, r.abstract, r.brief, **r.data)
        for s in r.sections:
            made = docs.section(made.n, s[SECTION.title], s[SECTION.body])
        self.complete(n, how=f"became doc {made.n}")
        return made
