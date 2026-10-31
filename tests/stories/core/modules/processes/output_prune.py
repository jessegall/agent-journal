from tests.stories.core.modules.processes.support.process_samples import ended_run
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_outputs_past_the_number_kept_are_pruned_oldest_first_and_their_folders_go(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run("setting make processes.outputs-kept 2")
    for number in range(3):
        ended_run(story, f"make step{number}", f"output {number}\n")
    story.expect_success("output show 1", "state: pruned", actor=story.agent)
    story.expect_success("output show 2", "state: kept", actor=story.agent)
    story.expect_success("output show 3", "state: kept", actor=story.agent)
    assert story.container.get(OutputFolder).line(1) == "" and story.container.get(OutputFolder).line(3) == "make step2"
