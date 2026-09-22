from controllers.base import Controller
from resources import types
from controllers.notices import Notices


class Rules(Controller):
    resource = types.Rule

    def inject(self, n: int):
        return self.update(n, injected=True)

    def uninject(self, n: int):
        return self.update(n, injected=False)

    def pin(self, n: int):
        rule = self.load(n)
        notices = Notices(self.record, actor=self.actor)
        standing = [notice for notice in notices.linked_to(rule.ref) if not notice.completed]
        return standing[0] if standing else notices.create(rule.title, about=rule.ref, link=f"#/{self.record.env}/rule/{n}", label="Open rule")
