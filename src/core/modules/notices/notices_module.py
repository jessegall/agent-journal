from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.notices.commands.close_notice_handler import CloseNoticeHandler
from core.modules.notices.commands.close_notice_subcommand import CloseNoticeSubcommand
from core.modules.notices.commands.make_notice_handler import MakeNoticeHandler
from core.modules.notices.commands.make_notice_subcommand import MakeNoticeSubcommand
from core.modules.notices.commands.notice_list_subcommand import NoticeListSubcommand
from core.modules.notices.migrations.m001_notices import NoticesTableMigration
from core.modules.notices.models.notice import Notice
from core.modules.notices.queries.notice_query import NoticeQuery


class NoticesModule(Module):
    """Adds notices: links pinned above an environment's chat for the person to open on their return."""

    name = "journal.core.notices"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments"]
    models = [ModelDeclaration(Notice, query=NoticeQuery, excluded_subcommands=["make", "edit", "list", "delete"])]
    migrations = [NoticesTableMigration]
    handlers = [MakeNoticeHandler, CloseNoticeHandler]
    subcommands = (MakeNoticeSubcommand, CloseNoticeSubcommand, NoticeListSubcommand)
