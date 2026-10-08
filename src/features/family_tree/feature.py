from features.base import Feature
from features.journal import Journal
from features.family_tree.details import FamilyTreeDetails
from features.family_tree.commands import ShowFamily
from features.family_tree.routes import get_family


class FamilyTree(Feature):
    details = FamilyTreeDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_family)
        journal.commands.add("agent", ShowFamily())
