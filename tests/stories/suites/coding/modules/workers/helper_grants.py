import subprocess

import pytest

from core.base.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.processes.support.runner_binary import RunnerBinary
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.support.phase_steps import dispatched_story_worker
from tests.stories.support.story_checks import expect_value

DISPATCH = "worker dispatch --model sonnet 1 --test-command python=pytest"
GRANT = 'helper grant {helper} git "tag|push" "-d|-m=*|explicit"'
REFUSED_LINE = "is not granted"


@pytest.fixture
def worker(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    UserJoined().steps(story)
    repository_environment(story)
    monkeypatch.setattr(RunnerBinary, "is_installed", lambda _runner: True)
    monkeypatch.setattr(subprocess, "Popen", lambda command, **options: None)
    return dispatched_story_worker(story, DISPATCH, monkeypatch)


@pytest.fixture
def granted(worker):
    worker.story.expect_success(GRANT.format(helper=worker.worker.id), actor=worker.story.agent)
    return worker


def newest_line(story) -> str:
    return story.container.get(Queries).query(Process).newest().first().line


def test_a_granted_subcommand_with_a_granted_flag_runs(granted):
    granted.story.expect_success("helper run git tag -d explicit", actor=granted.worker)
    expect_value(newest_line(granted.story), "git tag -d explicit")


@pytest.mark.parametrize("line", ['git tag -m "any words at all"', "git push explicit"])
def test_a_flag_with_any_value_and_an_exact_value_are_both_allowed(granted, line):
    granted.story.expect_success(f"helper run {line}", actor=granted.worker)


@pytest.mark.parametrize("line", ["git commit -m x", "git tag --force", "git push other", "make build"])
def test_what_the_grant_does_not_name_is_refused(granted, line):
    granted.story.expect_refusal(f"helper run {line}", REFUSED_LINE, actor=granted.worker)


def test_a_helper_with_no_grant_is_refused(worker):
    worker.story.expect_refusal("helper run git tag -d v1", REFUSED_LINE, actor=worker.worker)


def test_a_helper_may_not_grant_itself(worker):
    worker.story.expect_refusal(GRANT.format(helper=worker.worker.id), "main agent", actor=worker.worker)


def test_a_later_grant_for_the_same_program_replaces_the_earlier_one(granted):
    granted.story.expect_success(f'helper grant {granted.worker.id} git "status"', actor=granted.story.agent)
    granted.story.expect_refusal("helper run git tag -d v1", REFUSED_LINE, actor=granted.worker)
    granted.story.expect_success("helper run git status", actor=granted.worker)
