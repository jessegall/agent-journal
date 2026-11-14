from engine.module.model_declaration import ModelDeclaration
from core.modules.viewer.models.viewer_layout import ViewerLayout


class ViewerLayoutModelDeclaration(ModelDeclaration):
    """How the module declares ViewerLayout."""

    model = ViewerLayout
    excluded_subcommands = ["make", "edit"]
