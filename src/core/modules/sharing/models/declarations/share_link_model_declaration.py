from engine.module.model_declaration import ModelDeclaration
from core.modules.sharing.commands.deny_share_link.deny_share_link import DenyShareLink
from core.modules.sharing.commands.revoke_share_link.revoke_share_link import RevokeShareLink
from core.modules.sharing.models.share_link import ShareLink


class ShareLinkModelDeclaration(ModelDeclaration):
    """How the module declares ShareLink."""

    model = ShareLink
    commands = [RevokeShareLink, DenyShareLink]
    excluded_subcommands = ["make", "edit", "accept"]
