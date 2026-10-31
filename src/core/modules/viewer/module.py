from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading
from core.modules.viewer.migrations.m001_viewer import ViewerTables
from core.modules.viewer.viewer_layout import ViewerLayout
from core.modules.viewer.window_permission import WindowPermission

SHELL_RUNS = ["setting make"]
SHELL_READS = ["environment list", "environment show", "agent list", "agent show", "setting list", "setting show"]


class ViewerModule(Module):
    """Adds the viewer: the window the shell itself runs its lines as, the check of every line a window sends, each
    person's layouts and the permissions each person gives a window."""

    name = "journal.core.viewer"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.settings"]
    models = [ModelDeclaration(ViewerLayout), ModelDeclaration(WindowPermission)]
    migrations = [ViewerTables]
    windows = [WindowDeclaration("viewer.shell", "Viewer", "index.html", WindowLoading.PAGE, reads=SHELL_READS, runs=SHELL_RUNS)]
