from collections.abc import Sequence

from engine.command.context import Context
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.documents.models.link import Link
from core.modules.documents.models.link_correction import LinkCorrection

STORED_LINK_TARGETS = 25


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
        existing = self.stored(links)
        saved: list[Link] = []
        for link in links:
            key = self.key(link)
            if key not in existing:
                existing[key] = self.repository.save(link, context)
            saved.append(existing[key])
        return tuple(saved)

    def stored(self, links: Sequence[Link]) -> dict[tuple[str, int, str, int, str], Link]:
        target_ids: dict[tuple[str, int], list[int]] = {}
        for link in links:
            target_ids.setdefault((link.source_model, link.source_id), []).append(link.target_id)
        stored_links: dict[tuple[str, int, str, int, str], Link] = {}
        for (source_model, source_id), ids in target_ids.items():
            distinct = sorted(set(ids))
            for first in range(0, len(distinct), STORED_LINK_TARGETS):
                targets = Among("target_id", distinct[first:first + STORED_LINK_TARGETS])
                rows = self.queries.query(Link).filter(source_model=source_model, source_id=source_id).matching(targets).all_rows()
                stored_links.update({self.key(row): row for row in rows})
        return stored_links

    @staticmethod
    def key(link: Link) -> tuple[str, int, str, int, str]:
        return (link.source_model, link.source_id, link.target_model, link.target_id, link.link_type)
