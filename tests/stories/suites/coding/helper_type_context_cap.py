import json

from core.modules.settings.bindings.support.context_share import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_PROFILES, CONTEXT_LIMIT_TOKENS
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.suites.coding.support.main_controls_fixture import person_viewer
from tests.stories.support.story_checks import expect_value
from suites.coding.support.shipped_profiles import PLANNER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

USED_TOKENS = 50000
WINDOW_PERCENT = 20
PLANNER_CAP = 100000


class PlannerAndResearcher(StoryFixture):
    """The context limit is on at 400000 tokens, and a planner and a researcher run under the main agent."""

    parent = UserBuilder

    def steps(self, story):
        story.expect_success(f"setting set {CONTEXT_LIMIT_ENABLED} true --project", actor=story.user)
        story.expect_success(f"setting set {CONTEXT_LIMIT_TOKENS} 400000 --project", actor=story.user)
        for session, profile in (("planner-session", f"{PLANNER_PROFILE.name}"), ("researcher-session", f"{RESEARCHER_PROFILE.name}")):
            row_id = story.new_row_id(f"agent start {session} claude helper --parent {story.agent.id} --environment main")
            story.expect_success(f"agent edit {agent_number(story, row_id)} --profile {profile}")


def set_cap_on_the_screen(viewer, profile: str, cap: str) -> None:
    entries = json.dumps([f"{profile}:{cap}"])
    viewer.server.viewer_line_value(viewer.cookie, {"window": "coding.agent-settings", "environment": "main", "line": ["setting", "set", CONTEXT_LIMIT_PROFILES, entries, "--project"]})


def status_bar_rows(story) -> dict:
    rows = json.loads(story.run("usage show --environment main --json", actor=story.user).output_text)["agents"]
    return {row["session"]: row for row in rows}


def test_a_cap_set_on_the_planner_screen_is_the_cap_its_bar_shows_its_percent_of(new_story):
    story = new_story(fixture=PlannerAndResearcher)
    with person_viewer(story) as viewer:
        set_cap_on_the_screen(viewer, f"{PLANNER_PROFILE.name}", str(PLANNER_CAP))
    shown_cap = story.run(f"setting show {CONTEXT_LIMIT_PROFILES}", actor=story.user).output_text
    for session in ("planner-session", "researcher-session"):
        save_status_file(story, session, {"context_window": {"used_percentage": WINDOW_PERCENT, "total_input_tokens": USED_TOKENS}})
    rows = status_bar_rows(story)
    planner, researcher = rows["planner-session"], rows["researcher-session"]
    expect_value((f"{PLANNER_PROFILE.name}:{PLANNER_CAP}" in shown_cap, planner["context_percent"], planner["context_limit_tokens"], researcher["context_percent"], researcher["context_limit_tokens"]),
                 (True, 50, PLANNER_CAP, WINDOW_PERCENT, None))
