from journal.models.rule import Rule
from journal.repositories.repository import Repository


class Rules(Repository[Rule]):
    model = Rule
