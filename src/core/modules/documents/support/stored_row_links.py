from engine.cli.row_links import LINKS_SHOWN, RowLinks
from engine.query.queries import Queries
from core.modules.documents.models.link import Link
from core.modules.documents.conditions.link_scope import LinkScope
from core.modules.documents.models.enums.link_side import LinkSide
from core.modules.documents.conditions.first_link_counterpart import FirstLinkCounterpart
from core.modules.documents.references.row_ref import RowRef


class StoredRowLinks(RowLinks):
    """Names bounded distinct counterparts in both directions and gives the next page command."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def lines(self, model_name: str, row_id: int, exceptions: tuple[str, ...] = (), limit: int = LINKS_SHOWN) -> list[str]:
        reference = RowRef(model_name, row_id)
        scope = LinkScope(reference, LinkSide.ROW)
        query = self.queries.query(Link).matching(scope)
        page = query.matching(FirstLinkCounterpart(query.select, reference)).oldest().page(1, limit)
        names = tuple(scope.counterpart(link).text for link in page.rows)
        shown_names = tuple(name for name in names if name not in exceptions)
        lines = [f"links: {', '.join(shown_names)}"] if shown_names else []
        if not page.is_last:
            lines.append(f"{page.total - len(page.rows)} more links: journal link list --row {reference.text} --group-counterparts --page 2 --page-size {limit}")
        return lines
