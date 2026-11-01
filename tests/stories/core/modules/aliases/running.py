import json

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner, runner_line
from tests.stories.core.support.coding_fixtures import BuilderStarted, OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session

ALIAS_LINE = HookSamples.shell("journal sins --changes", ShellPart("journal", CommandCategory.JOURNAL, ["sins", "--changes"], subcommand="sins"))


def test_an_agent_line_that_runs_an_alias_runs_as_a_shell_line_with_the_normal_limit(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('alias add sins "echo judged"', actor=story.agent)
    assert dict(story.hook("s-1", ALIAS_LINE).updated_input) == {"command": runner_line(story, 1, "journal sins --changes")}


def test_a_background_alias_moves_to_the_background_at_once(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('alias add sins "echo judged" --background', actor=story.agent)
    assert dict(story.hook("s-1", ALIAS_LINE).updated_input) == {"command": runner_line(story, 1, "journal sins --changes", background=True)}


def test_the_alias_reader_reads_the_output_of_its_line(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add judge --commands "journal sins" --lines "sin"', actor=story.agent)
    story.run('alias add sins "echo judged" --reader judge', actor=story.agent)
    story.hook("s-1", ALIAS_LINE)
    reader_id = next(row["id"] for row in json.loads(story.run("reader list --json", actor=story.agent).output_text)["rows"] if row["name"] == "judge")
    story.expect_text("output show 1", f"reader_id: {reader_id}", actor=story.agent)


def worker_actor(new_story):
    story = install_runner(new_story(fixture=OrchestratorWithOpenTask))
    repository_environment(story)
    session = worker_session(story, dispatched_worker(story))
    agent = next(row for row in json.loads(story.run("agent list --json").output_text)["rows"] if row["session"] == session)
    return story, Actor(int(agent["id"]), ActorType.AGENT)


def test_a_worker_is_refused_an_alias_not_marked_for_workers(new_story):
    story, worker = worker_actor(new_story)
    story.run('alias add sins "echo judged"', actor=story.agent)
    story.expect_refusal("sins", "a worker runs only the aliases marked for workers, and sins is not", actor=worker)


def test_a_worker_runs_an_alias_marked_for_workers(new_story):
    story, worker = worker_actor(new_story)
    story.run('alias add sins "echo judged" --workers', actor=story.agent)
    story.expect_success("sins", "judged", actor=worker)
