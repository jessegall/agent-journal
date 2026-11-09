from collections.abc import Iterator
from contextlib import contextmanager

from core.base.shell_sandbox import ShellSandbox
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.testing.fake_launcher import FakeLauncher
from core.testing.story import Story
from core.testing.story_helper_programs import StoryHelperPrograms
from core.testing.story_shell_sandbox import StoryShellSandbox


def merger_can_start(monkeypatch) -> None:
    monkeypatch.setattr(ShellSandbox, "check", StoryShellSandbox.check)
    monkeypatch.setattr(HelperPrograms, "checked", StoryHelperPrograms.checked)
    monkeypatch.setattr(HelperPrograms, "installed", StoryHelperPrograms.installed)


@contextmanager
def running_launcher(story: Story) -> Iterator[None]:
    launcher = FakeLauncher(story.home.socket("launcher"))
    try:
        yield
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)


def expect_refused_with(story: Story, line: str, *texts: str, actor=None) -> None:
    outcome = story.run(line, actor=actor)
    assert outcome.code != 0 and all(text in outcome.output_text for text in texts), outcome.output_text
