from core.modules.notices.rules.agent_text_pin_rule import AgentTextPinRule
from core.modules.notices.rules.link_pin_rule import LinkPinRule
from core.modules.notices.support.notice_nudges import NOTICE_NUDGES
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.notices.commands.close_notice.close_notice_handler import CloseNoticeHandler
from core.modules.notices.commands.close_notice.close_notice_subcommand import CloseNoticeSubcommand
from core.modules.notices.commands.make_notice.make_notice_handler import MakeNoticeHandler
from core.modules.notices.commands.make_notice.make_notice_subcommand import MakeNoticeSubcommand
from core.modules.notices.commands.notice_list.notice_list_subcommand import NoticeListSubcommand
from core.modules.notices.migrations.m001_notices import NoticesTableMigration
from core.modules.notices.models.notice import Notice
from core.modules.notices.queries.notice_query import NoticeQuery
from core.modules.notices.seeders.notices_seeder import NoticesSeeder
from core.modules.notices.upgrade.notices_move import NoticesMove


class NoticesModule(Module):
    """Adds notices: links pinned above an environment's chat for the person to open on their return."""

    name = "journal.core.notices"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments"]
    nudges = NOTICE_NUDGES
    driver_rules = [LinkPinRule, AgentTextPinRule]
    seeders = [NoticesSeeder]
    models = [ModelDeclaration(Notice, query=NoticeQuery, excluded_subcommands=["make", "edit", "list", "delete"])]
    migrations = [NoticesTableMigration]
    moves = [NoticesMove]
    handlers = [MakeNoticeHandler, CloseNoticeHandler]
    subcommands = (MakeNoticeSubcommand, CloseNoticeSubcommand, NoticeListSubcommand)
