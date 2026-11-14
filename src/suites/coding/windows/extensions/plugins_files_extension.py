from engine.viewer.window_extension import WindowExtension


class PluginsFilesExtension(WindowExtension):
    """A link from the plugins window to the project's files."""

    window = "plugins.plugins"
    links = {"files": "coding.files"}
