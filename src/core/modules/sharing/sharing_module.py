from core.modules.sharing.windows.sharing_windows import SHARING_WINDOWS
from core.modules.sharing.models.declarations.share_link_model_declaration import ShareLinkModelDeclaration
from core.modules.sharing.models.declarations.share_comment_model_declaration import ShareCommentModelDeclaration
from core.modules.sharing.migrations.m003_share_comment_index import ShareCommentIndexMigration
from engine.module.module import Module
from core.modules.sharing.commands.make_share_link.make_share_link_handler import MakeShareLinkHandler
from core.modules.sharing.commands.make_share_link.make_share_link_subcommand import MakeShareLinkSubcommand
from core.modules.sharing.commands.share_session.share_session_subcommand import ShareSessionSubcommand
from core.modules.sharing.commands.accept_share_link.accept_share_link_handler import AcceptShareLinkHandler
from core.modules.sharing.commands.accept_share_link.accept_share_link_subcommand import AcceptShareLinkSubcommand
from core.modules.sharing.commands.count_share_view.count_share_view_handler import CountShareViewHandler
from core.modules.sharing.commands.count_share_view.count_share_view_subcommand import CountShareViewSubcommand
from core.modules.sharing.commands.leave_share_comment.leave_share_comment_handler import LeaveShareCommentHandler
from core.modules.sharing.commands.leave_share_comment.leave_share_comment_subcommand import LeaveShareCommentSubcommand
from core.modules.sharing.commands.share_comments.share_comments_subcommand import ShareCommentsSubcommand
from core.modules.sharing.commands.share_opens.share_opens_subcommand import ShareOpensSubcommand
from core.modules.sharing.commands.share_unlock.share_unlock_subcommand import ShareUnlockSubcommand
from core.modules.sharing.guards.share_link_row_guard import ShareLinkRowGuard
from core.modules.sharing.listeners.share_approval_listener import ShareApprovalListener
from core.modules.sharing.migrations.m005_share_approval_index import ShareApprovalIndexMigration
from core.modules.sharing.migrations.m002_share_options import ShareOptionsMigration
from core.modules.sharing.migrations.m001_share_links import ShareLinksTableMigration
from core.modules.sharing.migrations.m004_share_link_environment_index import ShareLinkEnvironmentIndexMigration
from core.modules.sharing.seeders.sharing_seeder import SharingSeeder
from core.modules.sharing.upgrade.share_move import ShareMove


class SharingModule(Module):
    """Lets a user share a document, a report or a plan as a read-only link, kept by the digest of its token
    until it expires or is
    revoked; an agent may ask for one, and visitors may comment if the link lets them."""

    name = "journal.core.sharing"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.environments", "journal.core.documents", "journal.core.messages", "journal.core.plans", "journal.core.tunnel"]
    models = [ShareLinkModelDeclaration, ShareCommentModelDeclaration]
    guards = [ShareLinkRowGuard]
    listeners = [ShareApprovalListener]
    migrations = [ShareCommentIndexMigration, ShareLinksTableMigration, ShareOptionsMigration, ShareLinkEnvironmentIndexMigration, ShareApprovalIndexMigration]
    subcommands = [MakeShareLinkSubcommand, ShareSessionSubcommand, AcceptShareLinkSubcommand, CountShareViewSubcommand, ShareUnlockSubcommand, LeaveShareCommentSubcommand, ShareCommentsSubcommand, ShareOpensSubcommand]
    handlers = [MakeShareLinkHandler, AcceptShareLinkHandler, CountShareViewHandler, LeaveShareCommentHandler]
    moves = [ShareMove]
    seeders = [SharingSeeder]
    windows = SHARING_WINDOWS
