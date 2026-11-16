from tests.stories.core.support.agent_labels import agent_number
import json
import shutil
from datetime import datetime, timedelta

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.messages.models.message import Message
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.environments.support.environment_rows import EnvironmentRows
from pathlib import Path
from tests.stories.core.modules.helpers.start_helper import START, started
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.suites.coding.modules.workers.support.program_split import (
    SAMPLE_MODULE, dispatch, exit_program, expect_program, new_task, outage, real_program_checks,
    set_split, split_story, split_viewer,
)
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from core.modules.helpers.support.helper_settings import ALLOWED_MODELS
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_LIMIT
from suites.coding.support.shipped_profiles import WORKER_SENIOR_PROFILE


@pytest.fixture
def failed_worker_story(split_story):
    launcher = FakeLauncher.accepting(split_story.home.socket('launcher'), request_count=4)
    worker = dispatch(split_story)
    split_story.run_listeners()
    exit_program(split_story, worker)
    return split_story, worker, launcher
















def test_split_passes_over_a_program_not_installed(split_story, monkeypatch, split_viewer):
    story = split_story
    set_split(story, 'claude 20,codex 80', viewer=split_viewer)
    real_program_checks(story)
    story.container.get(HelperPrograms).checked('claude', Path(story.container.get(EnvironmentRows).find(1).folder))
    monkeypatch.setattr(shutil, 'which', lambda name: None if name == 'codex' else name)
    worker = dispatch(story)
    expect_program(story, worker, 'claude')
    story.expect_text('worker split', 'codex', 'not installed')


@pytest.fixture
def window_split_story(split_story, request, split_viewer):
    set_split(split_story, viewer=split_viewer)
    resets_at = int((split_story.clock.timestamp().value + timedelta(hours=1)).timestamp())
    save_status_file(split_story, 's-1', {'rate_limits': {'five_hour': {'used_percentage': request.param, 'resets_at': resets_at}}})
    return split_story, dispatch(split_story)


def worker_starts(launcher, worker) -> list[dict[str, object]]:
    return [start for start in launcher.starts if start["agent_id"] == worker.id]










def test_worker_on_an_out_program_does_not_restart(failed_worker_story):
    story, worker, launcher = failed_worker_story
    WorkerResumeRetry()(story.container)
    WorkerResumeRetry()(story.container)
    lines = story.run(f'agent-line list --agent {story.agent.id}').output_text
    story.expect_rows(lines.count(f'worker:{worker.id} stopped') == 1)
    story.expect_text(f'worker status {agent_number(story, worker.id)}', 'Program: claude', 'rate limit', 'until', '09:15', f'journal worker release {agent_number(story, worker.id)}')
    story.expect_rows(len(worker_starts(launcher, worker)) == 1, detail=str(worker_starts(launcher, worker)))
    story.expect_text(f'agent show {agent_number(story, worker.id)}', 'ended_at:')


def test_worker_on_an_out_program_does_not_restart_until_the_outage_ends(failed_worker_story):
    story, worker, launcher = failed_worker_story
    story.advance(timedelta(minutes=15, seconds=1))
    WorkerResumeRetry()(story.container)
    story.run_listeners()
    starts = worker_starts(launcher, worker)
    story.expect_rows(len(starts) == 2, detail=f"the worker starts again once the outage ends: {starts}")








