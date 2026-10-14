from controllers.types import Agents
from expects import Answered, Given
from framework.base import Feature
from framework.journal import Journal
from features.family_tree.details import FamilyTreeDetails
from features.family_tree.commands import ShowFamily
from features.family_tree.routes import get_family
from resources.types import AgentRow


class FamilyTree(Feature):
    details = FamilyTreeDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_family)
        journal.commands.add("agent", ShowFamily(), expects=[
            Given((Agents,)) >> Answered({"members": [], "links": []}),
            Given((Agents,), rows=[AgentRow(n=1, title="claude-1")])
                >> Answered({"members": [{"id": "agent:t:claude-1", "label": "t · agent", "kind": "main", "environment": "t", "status": "", "detail": "", "n": 1, "session": "", "loops": 0}], "links": []}),
        ])
