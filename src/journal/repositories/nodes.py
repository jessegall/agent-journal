from journal.models.node import Node
from journal.repositories.repository import Repository


class Nodes(Repository[Node]):
    model = Node
