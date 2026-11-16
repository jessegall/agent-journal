from core.modules.documents.support.documents_dependencies import DOCUMENTS_DEPENDENCIES
from core.modules.documents.support.documents_models import DOCUMENTS_MODELS
from core.modules.documents.support.documents_migrations import DOCUMENTS_MIGRATIONS
from core.modules.documents.support.documents_handlers import DOCUMENTS_HANDLERS
from core.modules.documents.support.documents_listeners import DOCUMENTS_LISTENERS
from core.modules.documents.support.documents_bindings import DOCUMENTS_BINDINGS
from core.modules.documents.support.documents_subcommands import DOCUMENTS_SUBCOMMANDS
from core.modules.documents.states.open_document_states import OpenDocumentStates
from core.modules.documents.docks.documents_docks import DOCUMENTS_DOCKS
from core.modules.documents.skills.declarations.documents_skills import DOCUMENTS_SKILLS
from core.modules.documents.windows.documents_windows import DOCUMENTS_WINDOWS
from core.modules.documents.step_conditions.report_commented import ReportCommented
from core.modules.documents.support.document_closed import DocumentClosed
from engine.module.module import Module
from core.modules.documents.support.doc_library_share import DocLibraryShare
from core.modules.documents.agent_messages.document_open_message import DocumentOpenMessage
from core.modules.documents.agent_messages.document_stop_refusal_message import DocumentStopRefusalMessage
from core.modules.documents.models.document_row import DocumentRow
from core.modules.documents.marks.text_read_mark import TextReadMark
from core.modules.documents.seeders.documents_seeder import DocumentsSeeder
from core.modules.documents.upgrade.documents_move import DocumentsMove
from core.modules.documents.upgrade.message_links_move import MessageLinksMove
from core.modules.documents.inspectors.doc_inspector import DocInspector
from core.modules.documents.inspectors.report_inspector import ReportInspector
from core.modules.documents.tick_handlers.close_ended_documents_tick_handler import CloseEndedDocumentsTickHandler


class DocumentsModule(Module):
    """Adds documents, which keep lasting information about the project, reports of what was checked at one
    time, a document's revisions, and links between rows."""

    name = "journal.core.documents"
    requires_engine = ">=5,<6"
    dependencies = DOCUMENTS_DEPENDENCIES
    skills = DOCUMENTS_SKILLS
    agent_messages = [DocumentOpenMessage, DocumentStopRefusalMessage]
    models = DOCUMENTS_MODELS
    migrations = DOCUMENTS_MIGRATIONS
    block_conditions = [DocumentClosed]
    states = [OpenDocumentStates]
    tick_handlers = [CloseEndedDocumentsTickHandler]
    library_shares = [DocLibraryShare]
    moves = [DocumentsMove, MessageLinksMove]
    seeders = [DocumentsSeeder]
    windows = DOCUMENTS_WINDOWS
    inspectors = [DocInspector, ReportInspector]
    views = [DocumentRow]
    step_conditions = [ReportCommented]
    handlers = DOCUMENTS_HANDLERS
    listeners = DOCUMENTS_LISTENERS
    marks = [TextReadMark]
    docks = DOCUMENTS_DOCKS
    bindings = DOCUMENTS_BINDINGS
    subcommands = DOCUMENTS_SUBCOMMANDS
