from tests.stories.core.modules.processes.output_reader import append
from tests.stories.core.modules.processes.support.process_samples import install_runner, start_process, tick
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_pytest_progress_moves_before_the_result_line_ends(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = start_process(story, "pytest tests")
    append(story, process.id, "collected 4 items\n\ntests/a.py .")
    tick(story)
    story.expect_text(f"output show {process.id}", "progress: 25", actor=story.agent)
    append(story, process.id, "F")
    tick(story)
    story.expect_text(f"output show {process.id}", "progress: 50", actor=story.agent)
    append(story, process.id, ". [ 75%]\ntests/b.py .")
    tick(story)
    story.expect_text(f"output show {process.id}", "progress: 100", actor=story.agent)

