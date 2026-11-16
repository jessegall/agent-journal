from core.modules.sharing.declarations.sharing_dependencies import SHARING_DEPENDENCIES
from core.modules.sharing.declarations.sharing_migrations import SHARING_MIGRATIONS
from core.modules.sharing.declarations.sharing_subcommands import SHARING_SUBCOMMANDS
from core.modules.sharing.windows.sharing_windows import SHARING_WINDOWS
from core.modules.sharing.models.declarations.share_link_model_declaration import ShareLinkModelDeclaration
from core.modules.sharing.models.declarations.share_comment_model_declaration import ShareCommentModelDeclaration
from engine.module.module import Module
from core.modules.sharing.commands.make_share_link.make_share_link_handler import MakeShareLinkHandler
from core.modules.sharing.commands.accept_share_link.accept_share_link_handler import AcceptShareLinkHandler
from core.modules.sharing.commands.count_share_view.count_share_view_handler import CountShareViewHandler
from core.modules.sharing.commands.leave_share_comment.leave_share_comment_handler import LeaveShareCommentHandler
from core.modules.sharing.guards.share_link_row_guard import ShareLinkRowGuard
from core.modules.sharing.listeners.share_approval_listener import ShareApprovalListener
from core.modules.sharing.seeders.sharing_seeder import SharingSeeder
from core.modules.sharing.upgrade.share_move import ShareMove


class SharingModule(Module):
    """Lets a user share a document, a report or a plan as a read-only link, kept by the digest of its token
    until it expires or is
    revoked; an agent may ask for one, and visitors may comment if the link lets them."""

    name = "journal.core.sharing"
    requires_engine = ">=6,<7"
    dependencies = SHARING_DEPENDENCIES
    models = [ShareLinkModelDeclaration, ShareCommentModelDeclaration]
    guards = [ShareLinkRowGuard]
    listeners = [ShareApprovalListener]
    migrations = SHARING_MIGRATIONS
    subcommands = SHARING_SUBCOMMANDS
    handlers = [MakeShareLinkHandler, AcceptShareLinkHandler, CountShareViewHandler, LeaveShareCommentHandler]
    moves = [ShareMove]
    seeders = [SharingSeeder]
    windows = SHARING_WINDOWS
