from journal.http.controllers.controller import Controller
from journal.models.template import Template
from journal.repositories.templates import Templates


class TemplateController(Controller[Template]):
    """The shapes a row of a kind is written in."""

    def __init__(self, templates: Templates) -> None:
        self.repository = templates
