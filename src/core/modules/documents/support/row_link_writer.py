from collections.abc import Sequence

from core.base.command.context import Context
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.documents.models.link import Link
from core.modules.documents.models.link_correction import LinkCorrection
from core.modules.documents.references.row_ref import RowRef


class RowLinkWriter:
    """Saves each typed link once inside the command's write transaction."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def save(self, link: Link, context: Context) -> Link:
        return self.save_many([link], context)[0]

    def save_automatic(self, links: Sequence[Link], context: Context) -> tuple[Link, ...]:
        allowed = tuple(link for link in links if not self.queries.query(LinkCorrection).filter(
                        source_model=link.source_model, source_id=link.source_id, target_model=link.target_model,
                        target_id=link.target_id, link_type=link.link_type).exists())
        return self.save_many(allowed, context)

    def save_many(self, links: Sequence[Link], context: Context) -> tuple[Link, ...]:
        sources = dict.fromkeys(RowRef(link.source_model, link.source_id) for link in links)
        saved: list[Link] = []
        for source in sources:
            rows = self.queries.query(Link).filter(source_model=source.model, source_id=source.row_id).all_rows()
            existing = {(row.target_model, row.target_id, row.link_type): row for row in rows}
            for link in (row for row in links if row.source_model == source.model and row.source_id == source.row_id):
                key = (link.target_model, link.target_id, link.link_type)
                if key not in existing:
                    existing[key] = self.repository.save(link, context)
                saved.append(existing[key])
        return tuple(saved)

