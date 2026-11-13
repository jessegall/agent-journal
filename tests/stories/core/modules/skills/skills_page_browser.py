from engine.command.bus import Bus
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_skills_page_lists_loaded_skills_and_a_skill_mark_opens_the_skill_text_or_reports_it_missing(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    with server_story(story) as server:
        bus = story.container.get(Bus)
        bus.run(LoadSkill(story.agent.id, "journal", "digest"), story.agent)
        story.expect_text(f"agent-skill list --agent {story.agent.id}", "journal", "loaded", actor=story.agent)
        expect_browser(server, "skillsPage.browser.mjs", ["/tmp/journal-worker-481-skills.png"])
        bus.run(LoadSkill(story.agent.id, "journal-gone", "digest"), story.agent)
        story.run_listeners()
        expect_browser(server, "skillMark.browser.mjs", [])
