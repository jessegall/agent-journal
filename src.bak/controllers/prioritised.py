from resources.shapes import priority_level
from controllers.marks import action


class Prioritised:
    @action
    def priority(self, n: int, value: str):
        return self.update(int(n), priority=priority_level(value))
