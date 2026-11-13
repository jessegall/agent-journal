from collections.abc import Sequence

from engine.command.context import Context
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.documents.models.link import Link
from core.modules.documents.models.link_correction import LinkCorrection

CORRECTIONS_REASON = "every correction of the sources of the links being saved is compared with them"

STORED_LINKS_REASON = "the links to write are compared with every stored link of the row"

STORED_LINK_TARGETS = 25


class RowLinkWriter:
    """Saves each typed link once inside the command's write transaction."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def save(self, link: Link, context: Context) -> Link:
        return self.save_many([link], context)[0]

    def save_automatic(self, links: Sequence[Link], context: Context) -> tuple[Link, ...]:
        corrections = self.queries.query(LinkCorrection).matching(Among("source_id", [link.source_id for link in links])).every_row(CORRECTIONS_REASON)
        corrected = {(row.source_model, row.source_id, row.target_model, row.target_id, row.link_type) for row in corrections}
        allowed = tuple(link for link in links if (link.source_model, link.source_id, link.target_model, link.target_id, link.link_type) not in corrected)
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
                rows = self.queries.query(Link).filter(source_model=source_model, source_id=source_id).matching(targets).every_row(STORED_LINKS_REASON)
                stored_links.update({self.key(row): row for row in rows})
        return stored_links

    @staticmethod
    def key(link: Link) -> tuple[str, int, str, int, str]:
        return (link.source_model, link.source_id, link.target_model, link.target_id, link.link_type)
