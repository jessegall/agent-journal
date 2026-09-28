from resources.shapes import priority_level


class Prioritised:
    def priority(self, n: int, value: str):
        return self.update(int(n), priority=priority_level(value))
