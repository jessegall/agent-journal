import pytest
from contextlib import contextmanager

from tests.stories.server.support.server_client import started_server, ServerStory
from engine.file.file_access import FileAccess
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined


class SkillsPageReady(StoryFixture):
    """A person and an agent with journal, plugin and project skills available."""

    parent = UserJoined

    def steps(self, story):
        for key in ("session-start", "after-compaction", "main-agent"):
            story.expect_success(f"setting set journal.core.skills.{key} '[]' --project")
        story.expect_success("setting set journal.core.viewer.tour-completed true --project")
        story.expect_success("skill write")



class SkillTriggerReady(StoryFixture):
    """A skill trigger for the word cart, made by a person."""

    parent = SkillsPageReady

    def steps(self, story):
        story.expect_success('trigger make cart --do skill --skill journal --match-mode word', actor=story.user)


@contextmanager
def skills_server(story):
    with started_server(story.home) as (socket_path, context):
        yield ServerStory(story, socket_path, context)


@pytest.fixture
def skills_page_story(new_story):
    story = new_story(fixture=SkillsPageReady)
    for folder, plugin in (("sample-plugin", "plugin: sample\n"), ("project-notes", "")):
        path = story.home.project_folder / ".agents/skills" / folder / "SKILL.md"
        path.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(path, f"---\n{plugin}name: {folder}\ndescription: Take clear notes\n---\nRead before taking notes.\n")
    return story
