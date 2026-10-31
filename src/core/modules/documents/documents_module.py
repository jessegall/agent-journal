from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.documents.commands.close_text_handler import CloseTextHandler
from core.modules.documents.commands.doc_close_subcommand import DocCloseSubcommand
from core.modules.documents.commands.doc_comments_subcommand import DocCommentsSubcommand
from core.modules.documents.commands.doc_edit_subcommand import DocEditSubcommand
from core.modules.documents.commands.doc_list_subcommand import DocListSubcommand
from core.modules.documents.commands.doc_make_subcommand import DocMakeSubcommand
from core.modules.documents.commands.doc_revision_subcommand import DocRevisionSubcommand
from core.modules.documents.commands.doc_revisions_subcommand import DocRevisionsSubcommand
from core.modules.documents.commands.doc_show_subcommand import DocShowSubcommand
from core.modules.documents.commands.edit_text_handler import EditTextHandler
from core.modules.documents.commands.keep_revision_handler import KeepRevisionHandler
from core.modules.documents.commands.keep_revision_subcommand import KeepRevisionSubcommand
from core.modules.documents.commands.link_list_subcommand import LinkListSubcommand
from core.modules.documents.commands.make_text_handler import MakeTextHandler
from core.modules.documents.commands.record_mentions_handler import RecordMentionsHandler
from core.modules.documents.commands.report_close_subcommand import ReportCloseSubcommand
from core.modules.documents.commands.report_comments_subcommand import ReportCommentsSubcommand
from core.modules.documents.commands.report_edit_subcommand import ReportEditSubcommand
from core.modules.documents.commands.report_list_subcommand import ReportListSubcommand
from core.modules.documents.commands.report_make_subcommand import ReportMakeSubcommand
from core.modules.documents.commands.report_show_subcommand import ReportShowSubcommand
from core.modules.documents.listeners.doc_mention_listener import DocMentionListener
from core.modules.documents.listeners.report_mention_listener import ReportMentionListener
from core.modules.documents.migrations.m001_documents import DocumentsTablesMigration
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.doc_revision import DocRevision
from core.modules.documents.models.link import Link
from core.modules.documents.models.report import Report
from core.modules.documents.seeders.documents_seeder import DocumentsSeeder
from core.modules.documents.upgrade.documents_move import DocumentsMove

BUILT = ["make", "edit", "show", "list", "delete"]


class DocumentsModule(Module):
    """Adds documents, which the project keeps knowing, reports of what was checked at one time, a document's
    revisions, and links between rows."""

    name = "journal.core.documents"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.settings", "journal.core.messages", "journal.core.tasks", "journal.core.plans"]
    settings = [SettingValue("revision-minutes", "Revision minutes", "How long one person's edits of a document fold into one revision.", SettingType.NUMBER,
                             default=30, scope=SettingScope.PROJECT)]
    models = [ModelDeclaration(Doc, excluded_subcommands=BUILT), ModelDeclaration(Report, excluded_subcommands=BUILT),
              ModelDeclaration(DocRevision, excluded_subcommands=BUILT), ModelDeclaration(Link, excluded_subcommands=BUILT)]
    migrations = [DocumentsTablesMigration]
    moves = [DocumentsMove]
    seeders = [DocumentsSeeder]
    windows = [WindowDeclaration("documents.documents", "Documents", "documents.js", WindowLoading.COMPONENT, icon=WindowIcon.DOCUMENT,
                                 reads=["doc list", "doc show", "report list", "report show"], events=["doc.*", "report.*"])]
    handlers = [MakeTextHandler, EditTextHandler, CloseTextHandler, KeepRevisionHandler, RecordMentionsHandler]
    listeners = [DocMentionListener, ReportMentionListener]
    subcommands = (DocMakeSubcommand, DocEditSubcommand, DocShowSubcommand, DocListSubcommand, DocCloseSubcommand, KeepRevisionSubcommand,
                   DocRevisionsSubcommand, DocRevisionSubcommand, ReportMakeSubcommand, ReportEditSubcommand, ReportShowSubcommand, ReportListSubcommand,
                   ReportCloseSubcommand, LinkListSubcommand, DocCommentsSubcommand, ReportCommentsSubcommand)
