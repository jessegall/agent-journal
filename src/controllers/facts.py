from controllers.base import Controller
from resources import types
from controllers.rules import Rules


class Facts(Controller):
    resource = types.Fact

    def promote(self, n: int):
        pin = self.load(n)
        rule = Rules(self.record, actor=self.actor).create(pin.title, pin.abstract, pin.brief, **pin.data)
        self.complete(n, how=f"promoted to rule {rule.n}")
        return rule
