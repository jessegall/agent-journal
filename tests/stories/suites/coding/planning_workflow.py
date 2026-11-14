import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.database.database import Database
from engine.enums.model_tier import ModelTier
from engine.registry.registry import Registry
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.sequence_run import SequenceRun
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.stories.story_fixture import StoryFixture
from server.work.booting_work import BootingWork
from suites.coding.support.coding_settings import STARTS_HELPERS_SETTING
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.suites.coding.support.skill_expectations import expect_skill_text
from suites.coding.support.shipped_profiles import FUNCTIONAL_DESIGNER_PROFILE
from suites.coding.support.shipped_profiles import PLANNER_PROFILE

FUNCTIONAL_DESIGN = "Writing a functional design"
PLAN_BUILDING = "Building a plan"
FUNCTIONAL_DESIGNER = f"{FUNCTIONAL_DESIGNER_PROFILE.name}"
PLANNER = f"{PLANNER_PROFILE.name}"


class BundledSequences(StoryFixture):
    parent = UserBuilder

    def steps(self, story):
        story.run_listeners()
        BootingWork().run(story.container)
        story.run_listeners()
        story.helper = Actor(story.new_row_id(f"agent start sub-1 claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)


@pytest.fixture
def bundled_story(new_story):
    return new_story(fixture=BundledSequences)


def sequence_id(story, title):
    return next(row.id for row in story.story_rows(Sequence) if row.title == title)


def profile(story, name):
    return Registry.read(story.container.get(Database)).profile(name).profile


def test_the_functional_design_sequence_ships_and_walks_from_investigating_to_filing(bundled_story):
    bundled_story.expect_text(f"sequence show {sequence_id(bundled_story, FUNCTIONAL_DESIGN)}", FUNCTIONAL_DESIGN, "Read the skill journal-functional-design", "user stories",
                        "code examples", "phases", "journal doc make")


def test_a_read_only_helper_can_follow_the_functional_design_sequence_to_its_end(bundled_story):
    bundled_story.expect_success(f"sequence run {sequence_id(bundled_story, FUNCTIONAL_DESIGN)}", actor=bundled_story.helper)
    bundled_story.expect_text("sequence-run list", FUNCTIONAL_DESIGN, actor=bundled_story.helper)
    for _ in range(4):
        bundled_story.expect_success("sequence follow", actor=bundled_story.helper)
        bundled_story.expect_success("sequence next", actor=bundled_story.helper)
    runs = tuple(bundled_story.story_rows(SequenceRun))
    bundled_story.expect_rows(not [run for run in runs if run.session_agent_id == bundled_story.helper.id and run.ended_at is None], detail=str(runs))


def test_a_planner_making_a_plan_starts_the_plan_sequence_and_takes_its_goal_from_the_design(bundled_story):
    bundled_story.run(lines.NEW_PLAN, actor=bundled_story.helper)
    bundled_story.run_listeners()
    bundled_story.expect_text("sequence-run list", PLAN_BUILDING, actor=bundled_story.helper)
    bundled_story.expect_text(f"sequence show {sequence_id(bundled_story, PLAN_BUILDING)}", "When your job names a design document", "without deciding anything itself")


def test_the_functional_designer_runs_on_the_strongest_model_and_starts_its_sequence(bundled_story):
    designer = profile(bundled_story, FUNCTIONAL_DESIGNER)
    bundled_story.expect_rows(designer.agent_type == "helper", designer.tier == ModelTier.STRONGEST, designer.model == "opus", designer.codex_model == "gpt-6.1-sol",
                        FUNCTIONAL_DESIGN in designer.body, "skill journal-functional-design" in designer.body, detail=designer.body)


def test_the_planner_runs_on_a_cheaper_model_and_works_from_the_design(bundled_story):
    planner = profile(bundled_story, PLANNER)
    bundled_story.expect_rows(planner.agent_type == "helper", planner.tier == ModelTier.GENERAL, planner.model == "sonnet", planner.codex_model == "gpt-6.1-terra",
                        "functional design document" in planner.body, "cheaper model" in planner.body, detail=planner.body)


def test_the_functional_design_skill_asks_for_stories_examples_and_phases(bundled_story):
    bundled_story.run("skill write")
    expect_skill_text(bundled_story, "journal-functional-design", "name: journal-functional-design", "User stories", "Code examples", "Phases", "any application")


def test_the_functional_designer_must_read_the_user_stories_skill_and_is_given_it(bundled_story):
    designer = profile(bundled_story, FUNCTIONAL_DESIGNER)
    bundled_story.expect_rows("journal-user-stories" in designer.body, "mandatory" in designer.body, "journal-user-stories" in designer.skills, detail=designer.body)


def test_the_planner_turns_stories_into_story_books_of_one_task_each(bundled_story):
    planner = profile(bundled_story, PLANNER)
    bundled_story.expect_rows("story books" in planner.body, "one task" in planner.body, "names each story" in planner.body, "when the book is done" in planner.body, detail=planner.body)


def test_with_helpers_switched_off_the_main_agent_cannot_start_a_functional_designer(bundled_story):
    bundled_story.expect_success(f"setting set {STARTS_HELPERS_SETTING} false --project", actor=bundled_story.user)
    launcher = FakeLauncher.accepting(bundled_story.home.socket("launcher"), request_count=1)
    bundled_story.expect_refusal(f'helper start {FUNCTIONAL_DESIGNER} --brief "Design the cart" --environment main', "starts no read-only helper", actor=bundled_story.agent)
    launcher.server.close()
