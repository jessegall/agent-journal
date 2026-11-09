import os
from datetime import timedelta

from core.base.clock import Clock
from core.base.driver.tool_type import ToolType
from core.base.journal_home import JournalHome
from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.support.fixtures import UserJoined

CONTEXT_TEXT = "is still in your context and has not changed since it was read"


def read(path: str, **part: int):
    return HookSamples.tool_use("Read", ToolType.READ, [path], None).with_raw({"tool_input": {"file_path": path, **part}})


class ReadingAgent(StoryFixture):
    parent = UserJoined

    def steps(self, story):
        story.agent = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
        story.run_listeners()


def project_files(story):
    project = story.container.get(JournalHome).project_folder
    (project / "src").mkdir(exist_ok=True)
    (project / "src" / "cart.py").write_text("TAX = 0.2\n")
    (project / "AGENTS.md").write_text("# Rules\n")
    (project / "CLAUDE.md").write_text("@AGENTS.md\n")
    changed_at(story, project / "src" / "cart.py", timedelta(hours=-1))
    return story


def changed_at(story, file, offset: timedelta) -> None:
    timestamp = (story.container.get(Clock).timestamp().value + offset).timestamp()
    os.utime(file, (timestamp, timestamp))


def test_a_second_whole_read_of_an_unchanged_file_names_it(new_story):
    story = project_files(new_story(fixture=ReadingAgent))
    story.expect_hook_silent("s-1", read("src/cart.py"))
    story.expect_hook_allowed("s-1", read("src/cart.py"), f"src/cart.py {CONTEXT_TEXT}")


def test_a_read_of_a_part_or_of_a_changed_file_is_not_named(new_story):
    story = project_files(new_story(fixture=ReadingAgent))
    story.expect_hook_silent("s-1", read("src/cart.py"))
    story.expect_hook_silent("s-1", read("src/cart.py", offset=1, limit=1))
    cart = story.container.get(JournalHome).project_folder.joinpath("src", "cart.py")
    cart.write_text("TAX = 0.21\n")
    changed_at(story, cart, timedelta(minutes=1))
    story.expect_hook_silent("s-1", read("src/cart.py"))


def test_a_read_of_an_instruction_file_the_program_started_with_names_it(new_story):
    story = project_files(new_story(fixture=ReadingAgent))
    story.expect_hook_allowed("s-1", read("AGENTS.md"), f"AGENTS.md {CONTEXT_TEXT}")
    story.expect_hook_allowed("s-1", read("CLAUDE.md"), f"CLAUDE.md {CONTEXT_TEXT}")
