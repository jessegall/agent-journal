from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.helpers.helper_jobs import profile_agent, start_helper

SAMPLES = "tests.stories.core.modules.helpers.support.command_list_samples"
HELPER_REFUSAL = "A read-only helper may not run"


def started_profile(story, profile: str) -> Actor:
    start_helper(story, f'helper start {profile} --brief "Read src/cart.py" --environment main')
    return Actor(profile_agent(story, profile).id, ActorType.AGENT)


def test_a_profile_that_names_a_line_outside_its_type_stops_the_sync(journal):
    journal.expect_sync_refusal(f"{SAMPLES}:WideProfileModule", "profile sample-wide lists setting set, which its type helper does not list")


def test_a_typo_in_a_list_stops_the_boot_naming_the_type_and_the_line(journal):
    journal.expect_sync_refusal(f"{SAMPLES}:TypoClerkSuite", "helper type clerk lists the line task shwo, which no module serves")


def test_a_helper_type_registered_with_no_list_stops_the_boot_saying_so(journal):
    journal.expect_sync_refusal(f"{SAMPLES}:ListlessClerkSuite", "helper type clerk has no commands")
