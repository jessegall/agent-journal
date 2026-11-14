from tests.stories.core.modules.assignments.support.assignable_samples import DEPOT, UNBOUND, UNCOUNTED
from tests.stories.core.modules.assignments.support.assignment_fixtures import CratesAndActors, worker
from tests.stories.core.support.fixtures import UserJoined

ASSIGNMENTS = "assignment list --environment main"


def test_a_model_with_the_trait_and_one_actor_is_assignable_after_start(new_story):
    story = new_story(DEPOT, fixture=CratesAndActors)
    story.expect_success(f"assign crate 1 --to {worker(story).id} --environment main", actor=story.user)
    listed = story.run(ASSIGNMENTS, actor=story.user).output_text
    story.expect_rows(listed.count("crate") == 1, str(worker(story).id) in listed, detail=listed)


def test_a_many_actor_model_takes_two_actors_on_one_row(new_story):
    story = new_story(DEPOT, fixture=CratesAndActors)
    story.expect_success(f"assign pallet 1 --to {worker(story).id} --environment main", actor=story.user)
    story.expect_success(f"assign pallet 1 --to {story.user.id} --environment main", actor=story.user)
    listed = story.run(ASSIGNMENTS, actor=story.user).output_text
    story.expect_rows(listed.count("pallet") == 2, detail=listed)


def test_a_model_without_takes_actors_stops_the_journal_starting(new_story):
    story = new_story(fixture=UserJoined)
    code, text = story.synced_with(UNCOUNTED)
    story.expect_rows(code != 0, "Barrel is assignable and does not say how many actors a row takes" in text, detail=text)


def test_a_model_in_a_module_without_the_dependency_stops_the_journal_starting(new_story):
    story = new_story(fixture=UserJoined)
    code, text = story.synced_with(UNBOUND)
    story.expect_rows(code != 0, "acme.unbound owns the assignable Sack and does not depend on journal.core.assignments" in text, detail=text)


def test_a_model_that_is_not_assignable_is_refused_with_the_list(new_story):
    story = new_story(DEPOT, fixture=CratesAndActors)
    outcome = story.run(f"assign shelf 1 --to {worker(story).id} --environment main", actor=story.user)
    story.expect_rows(outcome.code != 0, "a shelf cannot be assigned" in outcome.output_text, "crate" in outcome.output_text, "pallet" in outcome.output_text, detail=outcome.output_text)
