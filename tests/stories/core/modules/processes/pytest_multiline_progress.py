from tests.stories.core.modules.processes.output_reader import append
from tests.stories.core.modules.processes.support.process_samples import install_runner, start_process, tick
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_pytest_progress_counts_marks_across_lines(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = start_process(story, "python3 -m pytest -q")
    append(story, process.id, "[100 items]\ntests/a.py " + "." * 60 + " [ 60%]\ntests/b.py " + "." * 10)
    tick(story)
    story.expect_text(f"output show {process.id}", "progress: 70", actor=story.agent)

