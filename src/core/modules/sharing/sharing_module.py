from core.modules.sharing.migrations.m003_share_comment_index import ShareCommentIndexMigration
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from engine.viewer.window_search import WindowSearch
from core.modules.sharing.support.share_searcher import ShareSearcher
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from core.modules.sharing.commands.make_share_link.make_share_link_handler import MakeShareLinkHandler
from core.modules.sharing.commands.make_share_link.make_share_link_subcommand import MakeShareLinkSubcommand
from core.modules.sharing.commands.revoke_share_link.revoke_share_link import RevokeShareLink
from core.modules.sharing.commands.share_session.share_session_subcommand import ShareSessionSubcommand
from core.modules.sharing.commands.accept_share_link.accept_share_link_handler import AcceptShareLinkHandler
from core.modules.sharing.commands.accept_share_link.accept_share_link_subcommand import AcceptShareLinkSubcommand
from core.modules.sharing.commands.count_share_view.count_share_view_handler import CountShareViewHandler
from core.modules.sharing.commands.count_share_view.count_share_view_subcommand import CountShareViewSubcommand
from core.modules.sharing.commands.deny_share_link.deny_share_link import DenyShareLink
from core.modules.sharing.commands.leave_share_comment.leave_share_comment_handler import LeaveShareCommentHandler
from core.modules.sharing.commands.leave_share_comment.leave_share_comment_subcommand import LeaveShareCommentSubcommand
from core.modules.sharing.commands.share_comments.share_comments_subcommand import ShareCommentsSubcommand
from core.modules.sharing.commands.share_opens.share_opens_subcommand import ShareOpensSubcommand
from core.modules.sharing.commands.share_unlock.share_unlock_subcommand import ShareUnlockSubcommand
from core.modules.sharing.guards.share_link_row_guard import ShareLinkRowGuard
from core.modules.sharing.listeners.share_approval_listener import ShareApprovalListener
from core.modules.sharing.migrations.m005_share_approval_index import ShareApprovalIndexMigration
from core.modules.sharing.migrations.m002_share_options import ShareOptionsMigration
from core.modules.sharing.models.share_comment import ShareComment
from core.modules.sharing.migrations.m001_share_links import ShareLinksTableMigration
from core.modules.sharing.migrations.m004_share_link_environment_index import ShareLinkEnvironmentIndexMigration
from core.modules.sharing.seeders.sharing_seeder import SharingSeeder
from core.modules.sharing.upgrade.share_move import ShareMove
from core.modules.sharing.models.share_link import ShareLink
from core.modules.sharing.support.skeletons import SHARING_SHARES_SKELETON


class SharingModule(Module):
    """Lets a user share a document, a report or a plan as a read-only link, kept by the digest of its token
    until it expires or is
    revoked; an agent may ask for one, and visitors may comment if the link lets them."""

    name = "journal.core.sharing"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.environments", "journal.core.documents", "journal.core.messages", "journal.core.plans", "journal.core.tunnel"]
    models = [ModelDeclaration(ShareLink, commands=[RevokeShareLink, DenyShareLink], excluded_subcommands=["make", "edit", "accept"]),
              ModelDeclaration(ShareComment, excluded_subcommands=["make", "edit", "delete"])]
    guards = [ShareLinkRowGuard]
    listeners = [ShareApprovalListener]
    migrations = [ShareCommentIndexMigration, ShareLinksTableMigration, ShareOptionsMigration, ShareLinkEnvironmentIndexMigration, ShareApprovalIndexMigration]
    subcommands = [MakeShareLinkSubcommand, ShareSessionSubcommand, AcceptShareLinkSubcommand, CountShareViewSubcommand, ShareUnlockSubcommand, LeaveShareCommentSubcommand, ShareCommentsSubcommand, ShareOpensSubcommand]
    handlers = [MakeShareLinkHandler, AcceptShareLinkHandler, CountShareViewHandler, LeaveShareCommentHandler]
    moves = [ShareMove]
    seeders = [SharingSeeder]
    windows = [WindowDeclaration("sharing.shares", "Shares", "shares.js", WindowLoading.COMPONENT, skeleton=SHARING_SHARES_SKELETON, search=WindowSearch(ShareSearcher, "Search the links"), group="project", icon=WindowIcon.SHARE,
                                 reads=["share list", "share comments", "share opens", "tunnel status"], runs=["share make", "share revoke", "share accept", "share deny"], events=["share_link.*", "share_comment.*"],
                                 keys=[WindowKey("shares", "share list", events=["share_link.*", "share_comment.*"]),
                                       WindowKey("tunnel", "tunnel status", loading=KeyLoading.REQUESTED),
                                       WindowKey("opens", "share opens", arguments=["target"], loading=KeyLoading.REQUESTED),
                                       WindowKey("comments.*", "share comments {id}", events=["share_comment.*"], loading=KeyLoading.REQUESTED)])]
