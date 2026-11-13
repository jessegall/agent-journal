from engine.command.bus import Bus
from core.modules.processes.commands.end_process.end_process import EndProcess
from tests.stories.core.modules.processes.support.process_samples import start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_a_wait_on_an_output_that_already_ended_is_refused_with_its_exit_code(new_story):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, "make test")
    story.container.get(Bus).run(EndProcess(process.id, 2, 40, 3), story.agent, environment_id=1)
    story.expect_refusal(f"wait on 'the tests' --target output:{process.id}", f"Output {process.id} failed with exit code 2", actor=story.agent)
    story.expect_no_text("wait list", "the tests", actor=story.agent)


def test_a_wait_on_an_output_that_still_runs_is_made_and_ends_with_it(new_story):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, "make test")
    story.expect_success(f"wait on 'the tests' --target output:{process.id}", actor=story.agent)
    story.container.get(Bus).run(EndProcess(process.id, 0, 40, 3), story.agent, environment_id=1)
    story.expect_text("wait show 1", "state: ended")


def test_a_wait_on_a_task_that_is_already_cancelled_is_refused_with_its_state(new_story):
    story = new_story(fixture=BuilderStarted, environment="main")
    task = story.new_row_id('task make "Dropped idea"', actor=story.agent)
    story.expect_success(f'task cancel {task} --reason "no longer needed"', actor=story.agent)
    story.expect_refusal(f"wait on 'the idea' --target tasks:{task}", f"tasks:{task} is already cancelled", actor=story.agent)


def test_a_wait_on_a_word_no_table_has_is_refused_with_the_words_it_takes(new_story):
    story = new_story(fixture=BuilderStarted, environment="main")
    process = start_process(story, "make test")
    story.expect_refusal(f"wait on 'the tests' --target outptu:{process.id}", "outptu is not a kind of row a wait can end on", actor=story.agent)
    story.expect_refusal(f"wait on 'the tests' --target outptu:{process.id}", "output", actor=story.agent)
    story.expect_refusal(f"wait on 'the tests' --target outptu:{process.id}", "question", actor=story.agent)
    story.expect_refusal(f"wait on 'the tests' --target outptu:{process.id}", "task", actor=story.agent)
    story.expect_success(f"wait on 'the tests' --target output:{process.id}", actor=story.agent)
