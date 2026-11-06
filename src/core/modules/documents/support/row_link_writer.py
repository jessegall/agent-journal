from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.documents.models.link import Link


class RowLinkWriter:
    """Saves each typed link once inside the command's write transaction."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def save(self, link: Link, context: Context) -> Link:
        existing = self.queries.query(Link).filter(source_model=link.source_model, source_id=link.source_id,
                                                  target_model=link.target_model, target_id=link.target_id,
                                                  link_type=link.link_type).first()
        if existing is not None:
            return existing
        return self.repository.save(link, context)
