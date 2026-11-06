from tests.stories.core.modules.processes.output_reader import append
from tests.stories.core.modules.processes.support.process_samples import install_runner, start_process, tick
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_vitest_progress_moves_as_tests_finish(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = start_process(story, "vitest run")
    append(story, process.id, "one.test.ts > first\none.test.ts > second\none.test.ts > third\none.test.ts > fourth\n ✓ one.test.ts (2 tests) 12ms\n")
    tick(story)
    story.expect_text(f"output show {process.id}", "progress: 50", actor=story.agent)
    append(story, process.id, " × second\n")
    tick(story)
    story.expect_text(f"output show {process.id}", "progress: 75", actor=story.agent)
