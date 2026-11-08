import json
import shlex
from datetime import timedelta

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.caller.caller import Caller
from core.base.caller.caller_request import CallerRequest
from core.base.cli.shell_aliases import ShellAliases
from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.queries.process_query import ProcessQuery
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, runner_line
from tests.stories.core.support.coding_fixtures import BuilderStarted, OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_updated_input_hook

ALIAS_LINE = HookSamples.shell("journal sins --changes", ShellPart("journal", CommandCategory.PROCESS, ["sins", "--changes"], subcommand="sins"))


def test_an_agent_line_that_runs_an_alias_runs_as_a_shell_line_with_the_normal_limit(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('alias add sins "echo judged"', actor=story.agent)
    expect_updated_input_hook(story, "s-1", ALIAS_LINE, {"command": runner_line(story, 1, "journal sins --changes").replace(" -- ", " --aliases sins -- ", 1)})


def test_an_alias_into_the_journals_folder_runs_from_any_folder_in_that_folder(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('alias add sins ".journal/plugins/judge/bin/judge judge {args}"', actor=story.agent)
    story.run('alias add lint "ruff check {args}"', actor=story.agent)
    aliases = story.container.get(ShellAliases)
    caller, worktree = Caller(story.agent), CallerRequest(folder="/work/worktrees/worker-1")
    judged = aliases.shell_run(["sins", "--changes"], caller, worktree)
    expect_row(judged, line=f"{shlex.quote(str(story.home.folder.resolve()))}/plugins/judge/bin/judge judge --changes")
    expect_row(judged, folder="/work/worktrees/worker-1")
    expect_shell_aliases(aliases, "lint", "src", caller, worktree, "ruff check src")


def test_a_background_alias_moves_to_the_background_at_once(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('alias add sins "echo judged" --background', actor=story.agent)
    expect_updated_input_hook(story, "s-1", ALIAS_LINE, {"command": runner_line(story, 1, "journal sins --changes", background=True).replace(" -- ", " --aliases sins -- ", 1)})


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
    story.expect_refusal("sins", "a worker runs only the aliases marked for agents, and sins is not", actor=worker)


def test_a_worker_runs_an_alias_marked_for_workers(new_story):
    story, worker = worker_actor(new_story)
    story.run('alias add sins "echo judged" --agents', actor=story.agent)
    story.expect_success("sins", "judged", actor=worker)


def test_a_background_alias_run_that_is_no_test_or_build_ends_with_an_ended_line_and_no_card(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add judge --commands "journal sins" --lines "sin"', actor=story.agent)
    story.run('alias add sins "echo judged" --reader judge --background', actor=story.agent)
    story.hook("s-1", ALIAS_LINE)
    process = story.container.get(ProcessQuery).find(1)
    story.container.get(Bus).run(MoveProcess(process.id), story.agent, environment_id=1)
    end_run(story, process, "sin one\nsin two\n")
    story.advance(timedelta(seconds=1))
    story.run_listeners()
    story.expect_absent("chat-mark list --json", "process:1")
    story.expect_hook_allowed("s-1", HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"])), "output 1 ended")


def test_the_file_the_hook_reads_names_each_aliass_shell_line(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('alias add go-tests "go test ./..."', actor=story.agent)
    story.run_listeners()
    expect_tests(story, "go test ./...")


def test_an_alias_of_a_journal_command_stays_in_the_foreground(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('alias add tasks "journal task list" --background', actor=story.agent)
    line = HookSamples.shell("journal tasks", ShellPart("journal", CommandCategory.JOURNAL, ["tasks"]))
    reply = story.hook("s-1", line)
    expect_updated_input_reply_without(reply, "--background")


def test_a_check_alias_goes_through_the_run_queue(new_story):
    # the hook classifies a journal line that runs an alias by what the alias runs, here a check such as the commandments judge
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('alias add sins "echo judged" --category check', actor=story.agent)
    line = HookSamples.shell("journal sins --changes", ShellPart("journal", CommandCategory.CHECK, ["sins", "--changes"], subcommand="sins"))
    reply = story.hook("s-1", line)
    story.expect_rows("--limit 15" in str(reply.updated_input), "--queue" in str(reply.updated_input), detail=str(reply.updated_input))


def expect_updated_input_reply_without(reply, expected) -> None:
    actual = str(reply.updated_input)
    assert expected not in actual, actual


def expect_tests(story, expected) -> None:
    actual = json.loads(story.home.alias_file.read_text())['go-tests']
    assert actual == expected, actual


def expect_shell_aliases(aliases, text, text_2, caller, worktree, expected) -> None:
    actual = aliases.shell_run([text, text_2], caller, worktree).line
    assert actual == expected, actual


def test_a_workers_alias_runs_in_its_worktree_and_the_main_agents_in_the_folder_it_asked_from(new_story):
    story = install_runner(new_story(fixture=OrchestratorWithOpenTask))
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    story.run('alias add sins "echo judged" --agents', actor=story.agent)
    aliases = story.container.get(ShellAliases)
    from_main = CallerRequest(folder=str(repository.folder))
    expect_row(aliases.shell_run(["sins"], Caller(worker), from_main), folder=str(repository.worktree_folder(worker.id).resolve()))
    expect_row(aliases.shell_run(["sins"], Caller(story.agent), from_main), folder=str(repository.folder))
