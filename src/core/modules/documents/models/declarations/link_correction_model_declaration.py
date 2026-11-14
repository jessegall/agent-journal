from engine.module.model_declaration import ModelDeclaration
from core.modules.documents.models.link_correction import LinkCorrection
from engine.module.model_declaration import ALL_SUBCOMMANDS


class LinkCorrectionModelDeclaration(ModelDeclaration):
    """How the module declares LinkCorrection."""

    model = LinkCorrection
    excluded_subcommands = ALL_SUBCOMMANDS
