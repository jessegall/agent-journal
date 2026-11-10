from engine.sandbox.shell_sandbox import ShellSandbox


class StoryShellSandbox(ShellSandbox):
    """A sandbox check for stories that do not start operating system shells, so a line needs no sandbox there."""

    is_required = False

    def check(self) -> None:
        pass
