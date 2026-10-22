from journal.features.seed import Seed
from journal.features.templates.shipped import SHIPPED
from journal.support.actor import Actor
from journal.repositories.templates import Templates
from journal.sync.team_account import TeamAccount


class BuiltinTemplates(Seed):
    """The shipped templates, written once by title; in a team only by the machine that holds the team's upgrade, so no two machines write the same one."""

    def __init__(self, templates: Templates, account: TeamAccount) -> None:
        self.templates, self.account = templates, account

    def run(self) -> None:
        if not self.account.is_seed_writer():
            return
        present = {template.title for template in self.templates.all()}
        for template in SHIPPED:
            if template.title not in present:
                self.templates.save(template, Actor.system())
