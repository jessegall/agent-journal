from core.base.cli.row_links import RowLinks
from core.base.query.queries import Queries
from core.modules.documents.models.link import Link

LINKS_SHOWN = 50


class StoredRowLinks(RowLinks):
    """Names the rows a row links to and the rows that link to it, newest first, each as number:model."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def lines(self, model_name: str, row_id: int) -> list[str]:
        links = self.queries.query(Link)
        outgoing_links = links.filter(source_model=model_name, source_id=row_id).newest().page(1, LINKS_SHOWN).rows
        incoming_links = links.filter(target_model=model_name, target_id=row_id).newest().page(1, LINKS_SHOWN).rows
        link_lines = [*(f"  {link.target_id}:{link.target_model}" for link in outgoing_links), *(f"  {link.source_id}:{link.source_model}" for link in incoming_links)]
        return ["links:", *link_lines] if link_lines else []
