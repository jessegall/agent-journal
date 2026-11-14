from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.processes.support.cadence_probe import kept_lines
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run
from tests.stories.core.modules.processes.support.reading_scenarios import STEPS, ended_after_a_while, received
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.modules.processes.support.process_nudges import READERS_NEED_REPAIR

REPAIR_LINE = READERS_NEED_REPAIR.nudge(reader='deploys', count=3).text


def test_a_reader_that_picks_no_line_is_reported_each_run_and_after_three_runs_is_listed_for_repair_while_an_empty_output_says_nothing(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add deploys --commands "./deploy*" --lines "NOTHING MATCHES THIS"', actor=story.agent)
    first = ended_after_a_while(story, moved_run(story, "./deploy.sh staging", CommandCategory.BUILD), STEPS)
    after_single = received(story)
    story.hook("s-1", HookSamples.session_start())
    story.run_listeners()
    early = kept_lines(story)
    for _ in range(2):
        ended_after_a_while(story, moved_run(story, "./deploy.sh staging", CommandCategory.BUILD), STEPS)
    empty = ended_after_a_while(story, moved_run(story, "./deploy.sh staging", CommandCategory.BUILD), "")
    after_empty = received(story)
    story.hook("s-1", HookSamples.session_start())
    story.run_listeners()
    story.expect_rows(f"Reader deploys matched none of the 10 lines of output {first.id}" in after_single, REPAIR_LINE not in early,
                      f"of output {empty.id}" not in after_empty, REPAIR_LINE in kept_lines(story), detail=f"{after_single}\n{after_empty}\n{kept_lines(story)}")
