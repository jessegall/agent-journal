import subprocess

import pytest

from engine.query.queries import Queries
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.processes.support.runner_binary import RunnerBinary
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, start_planned_worker
from tests.stories.support.story_checks import expect_value, expect_value_with

OUT_OF_RUNS_REFUSAL = "No test runs left"
GRANT = "helper grant {worker} pytest tests/cart.py"
RUN = "helper run pytest tests/cart.py"
GRANT_REFUSAL = "only a person or the main agent"


@pytest.fixture
def spent(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    worker.story.expect_success("setting set journal.suites.coding.workers.worker-phase-test-runs 0 --environment main", actor=worker.story.user)
    monkeypatch.setattr(RunnerBinary, "is_installed", lambda _runner: True)
    monkeypatch.setattr(subprocess, "Popen", lambda command, **options: None)
    return worker


@pytest.fixture
def granted(spent):
    spent.story.expect_success(GRANT.format(worker=spent.worker.id), actor=spent.story.agent)
    return spent


@pytest.mark.parametrize("line", ["worker allow-test 1", "merger allow 1", "worker-test-request list"])
def test_the_old_ways_of_allowing_a_test_are_gone(spent, line):
    expect_value(spent.story.run(line, actor=spent.story.agent).code == 0, False)


def test_a_grant_stays_so_the_same_test_runs_twice(granted):
    granted.story.expect_success(RUN, actor=granted.worker)
    granted.story.expect_success(RUN, actor=granted.worker)


def test_the_worker_reads_what_it_was_granted(granted):
    granted.story.expect_text("helper-grant show 1", "program: pytest", "subcommands: tests/cart.py", actor=granted.worker)


def test_a_worker_cannot_grant_itself_or_another_worker(spent):
    spent.story.expect_refusal(GRANT.format(worker=spent.worker.id), GRANT_REFUSAL, actor=spent.worker)


def test_a_grant_shows_as_a_mark_for_the_worker(granted):
    granted.story.run_listeners()
    marks = [mark.text for mark in granted.story.container.get(Queries).query(ChatMark).all_rows()]
    expect_value_with(" ".join(marks), "may run pytest")
