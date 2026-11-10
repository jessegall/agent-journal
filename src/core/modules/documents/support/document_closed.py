from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from engine.query.queries import Queries
from core.modules.documents.models.open_document import OpenDocument


class DocumentClosed(BlockCondition):
    """The author has closed the document."""

    name = "document-closed"
    subject_scoped = True

    def is_true(self, check: BlockCheck) -> bool:
        return not check.container.get(Queries).query(OpenDocument).filter(doc_id=int(self.text)).exists()
