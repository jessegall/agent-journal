from collections.abc import Mapping, Sequence

from engine.agent_stack.states.blocked import Blocked
from engine.agent_stack.row_reference import RowReference
from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.block_plan import BlockPlan
from engine.agent_machine.states.required_state import RequiredState
from engine.agent_machine.states.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.documents.models.open_document import OpenDocument
from core.modules.documents.agent_messages.document_open_message import DocumentOpenMessage
from core.modules.documents.agent_messages.document_stop_refusal_message import DocumentStopRefusalMessage
from core.modules.documents.support.document_closed import DocumentClosed

OPEN_DOCUMENT_RANK = "documents.open"
TOOL_RULE, STOP_RULE = "documents.open-document", "documents.open-document-stop"
OPEN_DOCUMENTS_REASON = "an agent holds at most one open document"


class OpenDocumentStates(StateSource):
    """Plans the block of a document an agent has open (doc 1310 section 4.6), read for a batch of agents at once: its
    tools at once (reads and journal commands pass), its stop at once, until journal doc close; the scopes keep the two
    keys and their two texts."""
    state_type = Blocked
    rank = OPEN_DOCUMENT_RANK

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        rows = self.queries.query(OpenDocument).matching(Among("author_id", [agent.agent_id for agent in agents])).every_row(OPEN_DOCUMENTS_REASON)
        return {row.author_id: [self.plan(row)] for row in rows}

    @staticmethod
    def plan(row: OpenDocument) -> BlockPlan:
        return BlockPlan(DocumentOpenMessage.declared().agent_message(doc=row.doc_id), DocumentClosed(row.doc_id), TOOL_RULE, OPEN_DOCUMENT_RANK, stop_check_key=STOP_RULE,
                         scope_stop=True, subject=RowReference("document", row.doc_id), lifting_lines=tuple([f"journal doc close {row.doc_id}"]),
                         stop_agent_message=DocumentStopRefusalMessage.declared().agent_message(doc=row.doc_id))
