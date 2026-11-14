from engine.enums.command_category import CommandCategory
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.runner_line import RunnerLine
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.documents.support.trail_fixtures import viewer
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session

OVERVIEW = HookSamples.shell("journal overview", ShellPart("journal", CommandCategory.JOURNAL, ["overview"], subcommand="overview"))


def test_the_card_of_a_worker_shows_the_output_of_journal_overview(new_story):
    story = install_runner(new_story(fixture=OpenTaskOrchestrator))
    repository_environment(story)
    worker = dispatched_worker(story)
    reply = story.hook(worker_session(story, worker), OVERVIEW)
    process = RunnerLine.process_id(dict(reply.updated_input)["command"])
    folder = story.container.get(OutputFolder)
    folder.write_start(process, "journal overview", ["journal overview"])
    folder.write_output(process, 1, "## skill required\nno skills to load\n")
    page = viewer(story, "agents.agents", ["output", "hook-page", str(reply.hook_call_id)])
    story.expect_rows(page["lines"] == ["## skill required", "no skills to load"])
