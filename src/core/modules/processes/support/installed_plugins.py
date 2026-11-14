class InstalledPlugins:
    """Says whether a plugin is installed, for the classes a person made for a plugin's runs. With no plugins module
    every plugin counts as installed; the plugins module binds the answer from its rows."""

    def names(self) -> frozenset[str] | None:
        return None

    def is_installed(self, plugin: str) -> bool:
        names = self.names()
        return names is None or plugin in names
