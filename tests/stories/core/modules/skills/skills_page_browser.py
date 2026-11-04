from core.base.command.bus import Bus
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_skills_page_lists_loaded_and_available_skills(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    with server_story(story) as server:
        story.container.get(Bus).run(LoadSkill(story.agent.id, "journal", "digest"), story.agent)
        story.expect_text(f"agent-skill list --agent {story.agent.id}", "journal", "loaded", actor=story.agent)
        expect_browser(server, "skillsPage.browser.mjs", ["/tmp/journal-worker-481-skills.png"])
