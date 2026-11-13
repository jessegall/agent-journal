from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.helpers.support.journal_hook_lines import journal_hook_line
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent, profile_agent
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.fixtures import MainEnvironment

SAMPLES = "tests.stories.core.modules.helpers.support.command_list_samples"
HELPER_REFUSAL = "A read-only helper may not run"


def started_profile(story, profile: str) -> Actor:
    story.expect_success(f'helper start {profile} --brief "Read src/cart.py" --environment main', actor=story.agent)
    return Actor(profile_agent(story, profile).id, ActorType.AGENT)


def test_a_reviewer_reads_and_records_a_review_and_is_refused_a_task_edit(new_story):
    story = new_story(fixture=UserBuilder)
    reviewer = started_profile(story, "journal-reviewer")
    story.expect_text("task list", actor=reviewer)
    story.expect_refusal("task edit 1 --complexity 2", f"{HELPER_REFUSAL} task edit", actor=reviewer)


def test_a_read_only_helper_runs_a_read_line_a_module_adds_later_and_is_refused_its_change_line(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_sync_success(f"{SAMPLES}:ShelvesModule")
    session = helper_agent(story).session
    story.expect_hook_allowed(session, journal_hook_line("shelf", "show"))
    story.expect_hook_refusal(session, journal_hook_line("shelf", "stock"), f"{HELPER_REFUSAL} shelf stock")


def test_an_outward_line_is_refused_to_a_read_only_helper_and_a_plan_is_made_only_by_a_profile_that_files_plans(new_story):
    story = new_story(fixture=UserBuilder)
    planner, debugger = started_profile(story, "journal-planner"), started_profile(story, "journal-debugger")
    story.expect_refusal("setting set journal.core.helpers.accept-every-approval true", f"{HELPER_REFUSAL} setting set", actor=planner)
    story.expect_success('plan make "Planned" --environment main', actor=planner)
    story.expect_refusal('plan make "Debugged" --environment main', f"{HELPER_REFUSAL} plan make", actor=debugger)


def test_a_profile_that_names_a_line_outside_its_type_stops_the_sync(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_refusal(f"{SAMPLES}:WideProfileModule", "profile sample-wide lists setting set, which its type helper does not list")


def test_a_typo_in_a_list_stops_the_boot_naming_the_type_and_the_line(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_refusal(f"{SAMPLES}:TypoClerkSuite", "helper type clerk lists the line task shwo, which no module serves")


def test_a_command_a_module_adds_reaches_no_helper_type_until_its_registration_lists_it(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_sync_success(f"{SAMPLES}:ShelvesModule")
    story.expect_hook_refusal(helper_agent(story).session, journal_hook_line("shelf", "stock"), f"{HELPER_REFUSAL} shelf stock")
    story.expect_text("shelf --help", "stock", actor=story.agent)


def test_a_helper_type_registered_with_no_list_stops_the_boot_saying_so(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_refusal(f"{SAMPLES}:ListlessClerkSuite", "helper type clerk has no commands")
