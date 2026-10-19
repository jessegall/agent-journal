from journal.http.controllers.controller import Controller
from journal.models.rule import Rule
from journal.repositories.rules import Rules


class RuleController(Controller[Rule]):
    """Rules the agent follows, each with why."""

    def __init__(self, rules: Rules) -> None:
        self.repository = rules
