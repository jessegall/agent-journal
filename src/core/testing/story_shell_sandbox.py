from core.base.shell_sandbox import ShellSandbox


class StoryShellSandbox(ShellSandbox):
    """A sandbox check for stories that do not start operating system shells."""

    def check(self) -> None:
        pass
