from tests.stories.core.modules.skills.support.skills_page_fixture import skills_page_story, skills_server
from tests.stories.server.support.browser_story import expect_browser_at


def test_the_skills_page_works_in_light_dark_and_phone_width_and_takes_pictures(skills_page_story):
    story = skills_page_story
    with skills_server(story) as server:
        key = server.viewer_key("Ada")
        expect_browser_at(f"http://127.0.0.1:{server.viewer_port()}/?key={key}&environment=main", "skillsDesign.browser.mjs", ["/tmp/worker-625-skills"])
