from journal.http.controllers.controller import Controller
from journal.models.fact import Fact
from journal.repositories.facts import Facts


class FactController(Controller[Fact]):
    """What the agent keeps knowing about the project."""

    def __init__(self, facts: Facts) -> None:
        self.repository = facts
