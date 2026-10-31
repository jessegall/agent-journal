from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.sharing.commands.make_share_link_handler import MakeShareLinkHandler
from core.modules.sharing.commands.make_share_link_subcommand import MakeShareLinkSubcommand
from core.modules.sharing.commands.revoke_share_link import RevokeShareLink
from core.modules.sharing.commands.share_session_subcommand import ShareSessionSubcommand
from core.modules.sharing.guards.share_link_row_guard import ShareLinkRowGuard
from core.modules.sharing.migrations.m001_share_links import ShareLinksTableMigration
from core.modules.sharing.upgrade.share_move import ShareMove
from core.modules.sharing.models.share_link import ShareLink


class SharingModule(Module):
    """Lets a person share a plan as a read-only link, kept by the digest of its token until it expires or is
    revoked."""

    name = "journal.core.sharing"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.plans"]
    models = [ModelDeclaration(ShareLink, commands=[RevokeShareLink], excluded_subcommands=["make", "edit"])]
    guards = [ShareLinkRowGuard]
    migrations = [ShareLinksTableMigration]
    subcommands = [MakeShareLinkSubcommand, ShareSessionSubcommand]
    handlers = [MakeShareLinkHandler]
    moves = [ShareMove]
    windows = [WindowDeclaration("sharing.shares", "Shares", "shares.js", WindowLoading.COMPONENT, icon=WindowIcon.SHARE,
                                 reads=["share list"], runs=["share make", "share revoke"])]
