from tests.stories.suites.coding.modules.workers.support.commit_command import asked_for_merge
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.core.support.agent_labels import agent_number
import json
import shlex
from pathlib import Path

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.support.coding_fixtures import OrchestratorWithPerson
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.support.story_checks import expect_value

MERGE_COMMANDS = "journal.suites.coding.workers.merge-commands"


def set_commands(story, commands: list[str]) -> None:
    story.expect_success(f"setting set {MERGE_COMMANDS} {shlex.quote(json.dumps(commands))} --project", actor=story.user)


def merge_story(new_story, commands: list[str]):
    story = new_story(fixture=OrchestratorWithPerson)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    set_commands(story, commands)
    return story, worker, repository


def test_s57_restart_retains_successful_steps(new_story):
    story, worker, repository = merge_story(new_story, ["echo ran >> ran.txt", "test -f marker.txt"])
    story.expect_refusal(f"worker merge --wait {agent_number(story, worker.id)}", "failed with code 1", actor=story.agent)
    Path(repository.folder, "marker.txt").write_text("")
    asked_for_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_text("task show 1", "state: completed", actor=story.agent)
    executed = Path(repository.folder, "ran.txt").read_text().splitlines()
    expect_value(executed, ["ran"])


def test_s57_uncertain_command_needs_reconciliation(new_story, monkeypatch):
    monkeypatch.setattr("suites.coding.modules.workers.commands.support.worktree_commands.COMMAND_LIMIT_SECONDS", 1)
    story, worker, _ = merge_story(new_story, ["sleep 3"])
    story.expect_refusal(f"worker merge --wait {agent_number(story, worker.id)}", "may have done part of its work", actor=story.agent)
    story.expect_refusal(f"worker merge --wait {agent_number(story, worker.id)}", "ended uncertain", actor=story.agent)
    story.expect_text("worker-worktree show 1", "state: delivered", actor=story.agent)
    asked_for_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)} --reconcile 'the command only waits'", actor=story.agent)
    story.expect_text("worker-worktree show 1", "state: removed", actor=story.agent)


def test_s57_later_merge_waits_for_required_followup(new_story):
    story, worker, repository = merge_story(new_story, ["false"])
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    second = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 2", actor=story.agent), ActorType.AGENT)
    repository.changed(second.id, "second.py", "TOTAL = 2\n")
    story.expect_success('proof make 1 --task 2 "second.py:1, the second story"', "point: 1", actor=second)
    story.expect_success(COMMIT, actor=second)
    story.expect_success("proof check 2", "state: checked", actor=story.agent)
    story.expect_success(f"worker logs {agent_number(story, second.id)}", actor=story.agent)
    story.expect_refusal(f"worker merge --wait {agent_number(story, worker.id)}", "failed with code 1", actor=story.agent)
    story.expect_refusal(f"worker merge --wait {agent_number(story, second.id)}", "still has required commands to run", actor=story.agent)
