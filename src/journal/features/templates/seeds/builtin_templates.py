from journal.features.seed import Seed
from journal.features.templates.shipped import SHIPPED
from journal.support.actor import Actor
from journal.repositories.templates import Templates


class BuiltinTemplates(Seed):
    """The shipped templates, written once by title."""

    def __init__(self, templates: Templates) -> None:
        self.templates = templates

    def run(self) -> None:
        present = {template.title for template in self.templates.all()}
        for template in SHIPPED:
            if template.title not in present:
                self.templates.save(template, Actor.system())
