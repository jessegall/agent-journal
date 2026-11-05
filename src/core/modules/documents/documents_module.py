from core.base.skill.skill_declaration import SkillDeclaration
from core.modules.documents.commands.record_subject_link.record_subject_link_handler import RecordSubjectLinkHandler
from core.modules.documents.listeners.plan_document_link_listener import PlanDocumentLinkListener
from core.modules.documents.listeners.reply_link_listener import ReplyLinkListener
from core.base.module.model_declaration import ALL_SUBCOMMANDS, ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_search import WindowSearch
from core.modules.documents.support.doc_library_share import DocLibraryShare
from core.modules.documents.support.doc_searcher import DocSearcher
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
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
from core.modules.documents.support.skeletons import DOCUMENTS_DOCUMENTS_SKELETON


class DocumentsModule(Module):
    """Adds documents, which the project keeps knowing, reports of what was checked at one time, a document's
    revisions, and links between rows."""

    name = "journal.core.documents"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.settings", "journal.core.messages", "journal.core.tasks", "journal.core.plans", "journal.core.docking", "journal.core.agents", "journal.core.drivers", "journal.core.processes", "journal.core.chat"]
    skills = [SkillDeclaration("journal-documents", "Write lasting knowledge as documents and what was checked as reports; read it before the first doc or report command of a session", keywords=("document", "documents", "report"), commands=("doc", "report"))]
    settings = [SettingValue("revision-minutes", "Revision minutes", "Combine edits by the same person into one revision within this many minutes.", SettingType.NUMBER,
                             default=30, scope=SettingScope.PROJECT)]
    models = [ModelDeclaration(Doc, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(Report, excluded_subcommands=ALL_SUBCOMMANDS),
              ModelDeclaration(DocRevision, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(Link, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(CommentSelection, excluded_subcommands=ALL_SUBCOMMANDS)]
    migrations = [DocumentsTablesMigration, LinkSourceIndexMigration, DockAbstractsMigration, CommentSelectionsMigration, ProjectDocumentsMigration]
    library_shares = [DocLibraryShare]
    moves = [DocumentsMove]
    seeders = [DocumentsSeeder]
    windows = [WindowDeclaration("documents.documents", "Documents", "documents.js", WindowLoading.COMPONENT, skeleton=DOCUMENTS_DOCUMENTS_SKELETON, search=WindowSearch(DocSearcher, "Search titles and abstracts"), place=WindowPlace.PAGE, group="project", icon=WindowIcon.DOCUMENT,
                                 reads=["document library", "doc show", "report show"], runs=["doc make", "report make"], events=["doc.*", "report.*"], shared_reads=["doc show id", "report show id"])]
    views = [DocumentRow]
    handlers = [RecordSubjectLinkHandler, CommentTextHandler, MakeTextHandler, EditTextHandler, CloseTextHandler, KeepRevisionHandler, RecordMentionsHandler]
    listeners = [PlanDocumentLinkListener, ReplyLinkListener, DocMentionListener, ReportMentionListener, TaskMentionListener, PlanMentionListener, MessageMentionListener, NewDocDockListener, NewReportDockListener, TextReadMarkListener]
    marks = TEXT_MARKS
    docks = TEXT_DOCKS
    bindings = {RowLinks: StoredRowLinks}
    subcommands = [CommentDocSubcommand, ReportCommentSubcommand, MakeDocSubcommand, EditDocSubcommand, DocShowSubcommand, DocListSubcommand, CloseDocSubcommand, KeepRevisionSubcommand,
                   DocRevisionsSubcommand, DocRevisionSubcommand, ReportMakeSubcommand, ReportEditSubcommand, ReportShowSubcommand, ReportListSubcommand,
                   ReportCloseSubcommand, DocumentLibrarySubcommand, LinkListSubcommand, DocCommentsSubcommand, ReportCommentsSubcommand, DocInspectSubcommand, ReportInspectSubcommand]
