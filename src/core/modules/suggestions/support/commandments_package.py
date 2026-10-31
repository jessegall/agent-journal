from core.base.journal_home import JournalHome

KEY = "code-commandments-as-plugin"
TITLE = "Code Commandments runs here as a package. Run it as a journal plugin instead?"
PACKAGE = "jessegall/code-commandments"
MANAGED_MARK = "@code-commandments-managed"
SETTINGS_FILES = (".claude/settings.json", ".claude/settings.local.json")
PLUGIN_NAME = "code-commandments"


class CommandmentsPackage:
    """Whether this project runs Code Commandments as a package (its composer.lock names it, or the Claude
    settings carry its managed mark) while no journal plugin of that name is installed."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def is_offered(self) -> bool:
        project = self.home.project_folder
        lock = project / "composer.lock"
        lock_match = lock.is_file() and PACKAGE in lock.read_text(errors="replace")
        settings_match = any((project / name).is_file() and MANAGED_MARK in (project / name).read_text(errors="replace") for name in SETTINGS_FILES)
        return (lock_match or settings_match) and not (self.home.folder / "plugins" / PLUGIN_NAME).is_dir()
