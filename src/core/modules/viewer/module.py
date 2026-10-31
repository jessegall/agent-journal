from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading

SHELL_RUNS = ["setting make"]
SHELL_READS = ["environment list", "environment show", "agent list", "agent show", "setting list", "setting show"]


class ViewerModule(Module):
    """Adds the viewer: the window the shell itself runs its lines as, and the check of every line a window sends."""

    name = "journal.core.viewer"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.settings"]
    windows = [WindowDeclaration("viewer.shell", "Viewer", "index.html", WindowLoading.PAGE, reads=SHELL_READS, runs=SHELL_RUNS)]
