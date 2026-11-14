from engine.viewer.window_extension import WindowExtension


class ShellChecksExtension(WindowExtension):
    """The checks the viewer's shell shows, runs and stops."""

    window = "viewer.shell"
    reads = ["check show"]
    runs = ["check run", "check stop"]
