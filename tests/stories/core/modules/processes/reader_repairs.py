from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.processes.support.cadence_probe import kept_lines
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run
from tests.stories.core.modules.processes.support.reading_scenarios import STEPS, ended_after_a_while, heard
from tests.stories.core.support.coding_fixtures import BuilderStarted

REPAIR_LINE = "reader deploys picked no line of its last 3 outputs: repair it"


def test_a_reader_that_picks_no_line_is_reported_each_run_and_after_three_runs_is_listed_for_repair_while_an_empty_output_says_nothing(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add deploys --commands "./deploy*" --lines "NOTHING MATCHES THIS"', actor=story.agent)
    first = ended_after_a_while(story, moved_run(story, "./deploy.sh staging", CommandCategory.BUILD), STEPS)
    after_one = heard(story)
    story.hook("s-1", HookSamples.session_start())
    story.run_listeners()
    early = kept_lines(story)
    for _ in range(2):
        ended_after_a_while(story, moved_run(story, "./deploy.sh staging", CommandCategory.BUILD), STEPS)
    empty = ended_after_a_while(story, moved_run(story, "./deploy.sh staging", CommandCategory.BUILD), "")
    after_empty = heard(story)
    story.hook("s-1", HookSamples.session_start())
    story.run_listeners()
    story.expect_rows(f"Reader deploys matched none of 10 lines of output {first.id}" in after_one, REPAIR_LINE not in early,
                      f"of output {empty.id}" not in after_empty, REPAIR_LINE in kept_lines(story), detail=f"{after_one}\n{after_empty}\n{kept_lines(story)}")
