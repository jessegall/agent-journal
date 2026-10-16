from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row
from journal.repositories.rules import Rules


class RulesShaper(Shaper):
    type = "rule"

    def __init__(self, rules: Rules) -> None:
        self.rules = rules

    def rows(self) -> list[V3Row]:
        return [V3Row.of("rule", r, title=r.text, brief=r.reason, data={"keywords": [], "keywords_in": "both", "injected": False, "proposed_for": ""}) for r in self.rules.all()]
