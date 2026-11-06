from core.base.skill.skill_declaration import SkillDeclaration
from core.modules.plans.commands.plan_context.read_plan_context_subcommand import ReadPlanContextSubcommand
from core.modules.documents.commands.plan_context.read_plan_context_handler import ReadPlanContextHandler
from core.modules.tasks.support.task_context_reader import TaskContextReader
from core.modules.documents.support.work_context_reader import WorkContextReader
from core.base.ticker.tick_handler import TickHandler
from core.base.ticker.tick_interval import TickInterval
from core.modules.documents.ticks.close_ended_documents_tick import CloseEndedDocumentsTick
from core.modules.documents.commands.open_doc.open_doc_handler import OpenDocHandler
from core.modules.documents.commands.open_doc.open_doc_subcommand import OpenDocSubcommand
from core.modules.documents.models.open_document import OpenDocument
from core.modules.documents.migrations.m006_revision_authors import RevisionAuthorsMigration
from core.modules.documents.rules.open_document_rule import OpenDocumentRule
from core.modules.documents.support.document_closed import DocumentClosed
from core.modules.documents.listeners.close_ended_document_listener import CloseEndedDocumentListener
from core.modules.documents.commands.record_subject_link.record_subject_link_handler import RecordSubjectLinkHandler
from core.modules.documents.listeners.plan_document_link_listener import PlanDocumentLinkListener
from core.modules.documents.listeners.reply_link_listener import ReplyLinkListener
from core.base.module.model_declaration import ALL_SUBCOMMANDS, ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_search import WindowSearch
from core.modules.documents.support.doc_library_share import DocLibraryShare
from core.modules.documents.support.doc_searcher import DocSearcher
from core.modules.documents.support.document_nudges import DOCUMENT_OPEN
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.documents.commands.comment_text.comment_text_handler import CommentTextHandler
from core.modules.documents.commands.comment_doc.comment_doc_subcommand import CommentDocSubcommand
from core.modules.documents.commands.report_comment.report_comment_subcommand import ReportCommentSubcommand
from core.modules.documents.commands.close_text.close_text_handler import CloseTextHandler
from core.modules.documents.commands.close_doc.close_doc_subcommand import CloseDocSubcommand
from core.modules.documents.commands.doc_comments.doc_comments_subcommand import DocCommentsSubcommand
from core.modules.documents.commands.doc_inspect.doc_inspect_subcommand import DocInspectSubcommand
from core.modules.documents.commands.report_inspect.report_inspect_subcommand import ReportInspectSubcommand
from core.modules.documents.commands.edit_doc.edit_doc_subcommand import EditDocSubcommand
from core.modules.documents.commands.doc_list.doc_list_subcommand import DocListSubcommand
from core.modules.documents.commands.document_library.document_library_subcommand import DocumentLibrarySubcommand
from core.modules.documents.commands.make_doc.make_doc_subcommand import MakeDocSubcommand
from core.modules.documents.commands.doc_revision.doc_revision_subcommand import DocRevisionSubcommand
from core.modules.documents.commands.doc_revisions.doc_revisions_subcommand import DocRevisionsSubcommand
from core.modules.documents.commands.doc_show.doc_show_subcommand import DocShowSubcommand
from core.modules.documents.commands.edit_text.edit_text_handler import EditTextHandler
from core.modules.documents.commands.keep_revision.keep_revision_handler import KeepRevisionHandler
from core.modules.documents.commands.keep_revision.keep_revision_subcommand import KeepRevisionSubcommand
from core.modules.documents.commands.link_list.link_list_subcommand import LinkListSubcommand
from core.modules.documents.commands.make_text.make_text_handler import MakeTextHandler
from core.modules.documents.commands.record_mentions.record_mentions_handler import RecordMentionsHandler
from core.modules.documents.commands.report_close.report_close_subcommand import ReportCloseSubcommand
from core.modules.documents.commands.report_comments.report_comments_subcommand import ReportCommentsSubcommand
from core.modules.documents.commands.report_edit.report_edit_subcommand import ReportEditSubcommand
from core.modules.documents.commands.report_list.report_list_subcommand import ReportListSubcommand
from core.modules.documents.commands.report_make.report_make_subcommand import ReportMakeSubcommand
from core.modules.documents.commands.report_show.report_show_subcommand import ReportShowSubcommand
from core.modules.documents.listeners.doc_mention_listener import DocMentionListener
from core.modules.documents.listeners.message_mention_listener import MessageMentionListener
from core.modules.documents.listeners.plan_mention_listener import PlanMentionListener
from core.modules.documents.listeners.task_mention_listener import TaskMentionListener
from core.modules.documents.listeners.report_mention_listener import ReportMentionListener
from core.modules.documents.migrations.m001_documents import DocumentsTablesMigration
from core.modules.documents.migrations.m002_link_source_index import LinkSourceIndexMigration
from core.modules.documents.migrations.m003_dock_abstracts import DockAbstractsMigration
from core.modules.documents.migrations.m004_comment_selections import CommentSelectionsMigration
from core.modules.documents.migrations.m005_project_documents import ProjectDocumentsMigration
from core.modules.documents.models.comment_selection import CommentSelection
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.doc_revision import DocRevision
from core.modules.documents.models.document_row import DocumentRow
from core.base.cli.row_links import RowLinks
from core.modules.documents.listeners.new_doc_dock_listener import NewDocDockListener
from core.modules.documents.listeners.new_report_dock_listener import NewReportDockListener
from core.modules.documents.models.link import Link
from core.modules.documents.support.stored_row_links import StoredRowLinks
from core.modules.documents.support.text_docks import TEXT_DOCKS
from core.modules.documents.support.text_marks import TEXT_MARKS
from core.modules.documents.listeners.text_read_mark_listener import TextReadMarkListener
from core.modules.documents.models.report import Report
from core.modules.documents.seeders.documents_seeder import DocumentsSeeder
from core.modules.documents.upgrade.documents_move import DocumentsMove
from core.modules.documents.upgrade.message_links_move import MessageLinksMove
from core.modules.documents.support.skeletons import DOCUMENTS_DOCUMENTS_SKELETON
from core.modules.documents.listeners.phase_mention_listener import PhaseMentionListener
from core.modules.documents.listeners.task_log_mention_listener import TaskLogMentionListener
from core.modules.documents.listeners.deleted_row_link_listener import DeletedRowLinkListener
from core.modules.documents.listeners.work_source_link_listener import WorkSourceLinkListener
from core.modules.documents.models.link_correction import LinkCorrection
from core.modules.documents.migrations.m007_link_corrections import LinkCorrectionsMigration
from core.modules.documents.commands.remove_link.remove_link_handler import RemoveLinkHandler
from core.modules.documents.commands.remove_link.remove_link_subcommand import RemoveLinkSubcommand
from core.modules.documents.listeners.link_correction_reset_listener import LinkCorrectionResetListener
from core.modules.tasks.commands.task_context.task_context_subcommand import TaskContextSubcommand


class DocumentsModule(Module):
    """Adds documents, which keep lasting information about the project, reports of what was checked at one
    time, a document's revisions, and links between rows."""

    name = "journal.core.documents"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.settings", "journal.core.messages", "journal.core.tasks", "journal.core.plans", "journal.core.docking", "journal.core.agents", "journal.core.drivers", "journal.core.processes", "journal.core.chat"]
    skills = [SkillDeclaration("journal-documents", "Write lasting information as documents and what was checked as reports; read it before the first doc or report command of a session", keywords=("document", "documents", "report"), commands=("doc", "report"))]
    nudges = [DOCUMENT_OPEN]
    models = [ModelDeclaration(OpenDocument, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(Doc, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(Report, excluded_subcommands=ALL_SUBCOMMANDS),
              ModelDeclaration(DocRevision, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(Link, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(CommentSelection, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(LinkCorrection, excluded_subcommands=ALL_SUBCOMMANDS)]
    migrations = [DocumentsTablesMigration, LinkSourceIndexMigration, DockAbstractsMigration, CommentSelectionsMigration, ProjectDocumentsMigration, RevisionAuthorsMigration, LinkCorrectionsMigration]
    driver_rules = [OpenDocumentRule]
    block_conditions = [DocumentClosed]
    tick_handlers = [TickHandler(TickInterval(seconds=5), CloseEndedDocumentsTick(), "close ended documents", starts_immediately=True)]
    library_shares = [DocLibraryShare]
    moves = [DocumentsMove, MessageLinksMove]
    seeders = [DocumentsSeeder]
    windows = [WindowDeclaration("documents.documents", "Documents", "documents.js", WindowLoading.COMPONENT, skeleton=DOCUMENTS_DOCUMENTS_SKELETON, search=WindowSearch(DocSearcher, "Search titles and abstracts"), place=WindowPlace.EITHER, group="project", icon=WindowIcon.DOCUMENT,
                                 reads=["document library", "doc show", "report show", "doc inspect", "report inspect", "doc comments", "report comments", "link list"], runs=["doc make", "report make"], events=["doc.*", "report.*"], shared_reads=["doc show id", "report show id"])]
    views = [DocumentRow]
    handlers = [OpenDocHandler, RecordSubjectLinkHandler, CommentTextHandler, MakeTextHandler, EditTextHandler, CloseTextHandler, KeepRevisionHandler, RecordMentionsHandler, RemoveLinkHandler, ReadPlanContextHandler]
    listeners = [CloseEndedDocumentListener, PlanDocumentLinkListener, ReplyLinkListener, WorkSourceLinkListener, DocMentionListener, ReportMentionListener, PlanMentionListener, TaskMentionListener, MessageMentionListener, PhaseMentionListener, TaskLogMentionListener, DeletedRowLinkListener, NewDocDockListener, NewReportDockListener, TextReadMarkListener, LinkCorrectionResetListener]
    marks = TEXT_MARKS
    docks = TEXT_DOCKS
    bindings = {RowLinks: StoredRowLinks, TaskContextReader: WorkContextReader}
    subcommands = [OpenDocSubcommand, CommentDocSubcommand, ReportCommentSubcommand, MakeDocSubcommand, EditDocSubcommand, DocShowSubcommand, DocListSubcommand, CloseDocSubcommand, KeepRevisionSubcommand,
                   DocRevisionsSubcommand, DocRevisionSubcommand, ReportMakeSubcommand, ReportEditSubcommand, ReportShowSubcommand, ReportListSubcommand,
                   ReportCloseSubcommand, DocumentLibrarySubcommand, LinkListSubcommand, DocCommentsSubcommand, ReportCommentsSubcommand, DocInspectSubcommand, ReportInspectSubcommand, RemoveLinkSubcommand, TaskContextSubcommand, ReadPlanContextSubcommand]
