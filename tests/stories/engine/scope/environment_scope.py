from core.modules.memories.models.memory import Memory
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.memories.support.memory_owners import MAIN_FACT, MAIN_MEMORY, MainAndWorkerMemories


class TwoEnvironments(StoryFixture):
    """The memories of main beside an environment staging with memory 3, made by a person."""

    parent = MainAndWorkerMemories

    def steps(self, story):
        story.run("environment make staging /work/staging")
        story.run('memory make "Staging has no queue" --environment staging', actor=story.user)

    def expect(self, story):
        story.expect_success("environment show 2", "name: staging")


def test_a_person_s_request_reads_a_row_of_the_environment_it_names(new_story):
    story = new_story(fixture=TwoEnvironments)
    story.expect_success(f"memory show {MAIN_MEMORY} --environment main", f"text: {MAIN_FACT}", actor=story.user)


def test_a_person_s_request_may_name_the_environment_by_its_number(new_story):
    story = new_story(fixture=TwoEnvironments)
    story.expect_refusal(f"memory show {MAIN_MEMORY} --environment 2", "no memory", actor=story.user)


def test_a_person_s_request_with_no_environment_reads_every_environment(new_story):
    story = new_story(fixture=TwoEnvironments)
    story.use_fixture_environment(None)
    story.expect_text("memory list", MAIN_FACT, "Staging has no queue", actor=story.user)


def test_a_person_s_command_cannot_change_a_row_of_another_environment(new_story):
    story = new_story(fixture=TwoEnvironments)
    story.expect_refusal(f'memory edit {MAIN_MEMORY} --text "Changed" --environment staging', "no memory", actor=story.user)


def test_a_person_s_read_of_an_unknown_environment_is_refused(new_story):
    story = new_story(fixture=TwoEnvironments)
    story.expect_refusal("memory list --environment nowhere", "nowhere", actor=story.user)


def test_a_job_outside_any_request_reads_every_environment(new_story):
    story = new_story(fixture=TwoEnvironments)
    story.expect_rows(len(story.story_rows(Memory)) == 3)


def test_the_scope_of_a_request_ends_with_it(new_story):
    story = new_story(fixture=TwoEnvironments)
    story.run("memory list --environment staging", actor=story.user)
    story.expect_rows(len(story.story_rows(Memory)) == 3)
