import json
from datetime import timedelta

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.queries.process_query import ProcessQuery
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, runner_line
from tests.stories.core.support.coding_fixtures import BuilderStarted, OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session

ALIAS_LINE = HookSamples.shell("journal sins --changes", ShellPart("journal", CommandCategory.PROCESS, ["sins", "--changes"], subcommand="sins"))


def test_an_agent_line_that_runs_an_alias_runs_as_a_shell_line_with_the_normal_limit(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('alias add sins "echo judged"', actor=story.agent)
    assert dict(story.hook("s-1", ALIAS_LINE).updated_input) == {"command": runner_line(story, 1, "journal sins --changes").replace(" -- ", " --aliases sins -- ", 1)}


def test_a_background_alias_moves_to_the_background_at_once(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('alias add sins "echo judged" --background', actor=story.agent)
    assert dict(story.hook("s-1", ALIAS_LINE).updated_input) == {"command": runner_line(story, 1, "journal sins --changes", background=True).replace(" -- ", " --aliases sins -- ", 1)}


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


def test_a_background_alias_run_ends_with_a_card_and_an_ended_line(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add judge --commands "journal sins" --lines "sin"', actor=story.agent)
    story.run('alias add sins "echo judged" --reader judge --background', actor=story.agent)
    story.hook("s-1", ALIAS_LINE)
    process = story.container.get(ProcessQuery).find(1)
    story.container.get(Bus).run(MoveProcess(process.id), story.agent, environment_id=1)
    end_run(story, process, "sin one\nsin two\n")
    story.advance(timedelta(seconds=1))
    story.run_listeners()
    story.expect_text("chat-mark list --json", "process:1", "ended")
    assert any("output 1 ended" in line for line in story.hook("s-1", HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"]))).lines)


def test_the_file_the_hook_reads_names_each_aliass_shell_line(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('alias add go-tests "go test ./..."', actor=story.agent)
    story.run_listeners()
    assert json.loads(story.home.alias_file.read_text())["go-tests"] == "go test ./..."


def test_an_alias_of_a_journal_command_stays_in_the_foreground(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('alias add tasks "journal task list" --background', actor=story.agent)
    line = HookSamples.shell("journal tasks", ShellPart("journal", CommandCategory.JOURNAL, ["tasks"]))
    reply = story.hook("s-1", line)
    assert "--background" not in str(reply.updated_input), reply.updated_input

