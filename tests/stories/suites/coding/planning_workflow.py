import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.database.database import Database
from core.base.profile.model_tier import ModelTier
from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.sequence_run import SequenceRun
from core.testing.fake_launcher import FakeLauncher
from core.testing.story_fixture import StoryFixture
from server.booting_work import BootingWork
from suites.coding.support.coding_settings import STARTS_HELPERS_SETTING
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.suites.coding.support.skill_expectations import expect_skill_text

FUNCTIONAL_DESIGN = "Writing a functional design"
PLAN_BUILDING = "Building a plan"
FUNCTIONAL_DESIGNER = "journal-functional-designer"
PLANNER = "journal-planner"


class BundledSequences(StoryFixture):
    parent = UserBuilder

    def steps(self, story):
        story.run_listeners()
        BootingWork().run(story.container)
        story.run_listeners()
        story.helper = Actor(story.new_row_id(f"agent start sub-1 claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)


@pytest.fixture
def shipped(new_story):
    return new_story(fixture=BundledSequences)


def sequence_id(story, title):
    return next(row.id for row in story.container.get(Queries).query(Sequence).all_rows() if row.title == title)


def profile(story, name):
    return Registry.read(story.container.get(Database)).profile(name).profile


def test_the_functional_design_sequence_ships_and_walks_from_investigating_to_filing(shipped):
    shipped.expect_text(f"sequence show {sequence_id(shipped, FUNCTIONAL_DESIGN)}", FUNCTIONAL_DESIGN, "Read the skill journal-functional-design", "user stories",
                        "code examples", "phases", "journal doc make")


def test_a_read_only_helper_can_follow_the_functional_design_sequence_to_its_end(shipped):
    shipped.expect_success(f"sequence run {sequence_id(shipped, FUNCTIONAL_DESIGN)}", actor=shipped.helper)
    shipped.expect_text("sequence-run list", FUNCTIONAL_DESIGN, actor=shipped.helper)
    for _ in range(4):
        shipped.expect_success("sequence follow", actor=shipped.helper)
        shipped.expect_success("sequence next", actor=shipped.helper)
    runs = tuple(shipped.container.get(Queries).query(SequenceRun).all_rows())
    shipped.expect_rows(not [run for run in runs if run.session_agent_id == shipped.helper.id and run.ended_at is None], detail=str(runs))


def test_a_planner_making_a_plan_starts_the_plan_sequence_and_takes_its_goal_from_the_design(shipped):
    shipped.run(lines.NEW_PLAN, actor=shipped.helper)
    shipped.run_listeners()
    shipped.expect_text("sequence-run list", PLAN_BUILDING, actor=shipped.helper)
    shipped.expect_text(f"sequence show {sequence_id(shipped, PLAN_BUILDING)}", "When your job names a design document", "without deciding anything itself")


def test_the_functional_designer_runs_on_the_strongest_model_and_starts_its_sequence(shipped):
    designer = profile(shipped, FUNCTIONAL_DESIGNER)
    shipped.expect_rows(designer.agent_type == "helper", designer.tier == ModelTier.STRONGEST, designer.model == "opus", designer.codex_model == "gpt-6.1-sol",
                        FUNCTIONAL_DESIGN in designer.body, "skill journal-functional-design" in designer.body, detail=designer.body)


def test_the_planner_runs_on_a_cheaper_model_and_works_from_the_design(shipped):
    planner = profile(shipped, PLANNER)
    shipped.expect_rows(planner.agent_type == "helper", planner.tier == ModelTier.GENERAL, planner.model == "sonnet", planner.codex_model == "gpt-6.1-terra",
                        "functional design document" in planner.body, "cheaper model" in planner.body, detail=planner.body)


def test_the_main_agent_skill_names_who_to_dispatch_and_what_to_do_when_helpers_are_off(shipped):
    shipped.run("skill write")
    expect_skill_text(shipped, "journal-plan-dispatch", "name: journal-plan-dispatch", FUNCTIONAL_DESIGNER, PLANNER, "When read-only helpers are switched off", "journal-planning")


def test_the_functional_design_skill_asks_for_stories_examples_and_phases(shipped):
    shipped.run("skill write")
    expect_skill_text(shipped, "journal-functional-design", "name: journal-functional-design", "User stories", "Code examples", "Phases", "any application")


def test_the_planning_skill_stays_the_planners_and_takes_a_design_as_its_source(shipped):
    shipped.run("skill write")
    expect_skill_text(shipped, "journal-planning", "name: journal-planning", "functional design document", "cheaper model")


def test_with_helpers_switched_off_the_main_agent_cannot_start_a_functional_designer(shipped):
    shipped.expect_success(f"setting set {STARTS_HELPERS_SETTING} false --project", actor=shipped.user)
    launcher = FakeLauncher(shipped.home.socket("launcher"), request_count=1)
    shipped.expect_refusal(f'helper start {FUNCTIONAL_DESIGNER} --brief "Design the cart" --environment main', "starts no read-only helper", actor=shipped.agent)
    launcher.server.close()
