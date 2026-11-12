from tests.stories.core.support.agent_labels import agent_number
import json
import shutil
from contextlib import contextmanager, nullcontext
from unittest.mock import patch
from engine.time.clock import Clock
from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.module.module import Module
from engine.enums.hook_trust import HookTrust
from engine.enums.model_tier import ModelTier
from engine.provider.program_model import ProgramModel
from engine.provider.providers import Providers
from core.modules.helpers.support.helper_programs import HelperPrograms
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.server.support.server_client import server_story, viewer_answer
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.unit.engine.samples.program_sample import SampleProgram
from tests.stories.support.program_states import real_program_states

SPLIT = 'journal.core.helpers.program-split'
SAMPLE_MODULE = 'tests.stories.suites.coding.modules.workers.support.program_split:SplitProgramModule'


class SplitProgram(SampleProgram):
    """A third provider with a model for every tier."""

    models = [ProgramModel('sample-fast', ModelTier.FAST), ProgramModel('sample-general', ModelTier.GENERAL),
              ProgramModel('sample-strongest', ModelTier.STRONGEST)]


class SplitProgramModule(Module):
    name = 'sample.split-program'
    requires_core = '>=5,<6'
    providers = [SplitProgram]


@pytest.fixture
def split_story(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    monkeypatch.setattr(shutil, 'which', lambda name: name)
    for provider in story.container.get(Providers).all():
        monkeypatch.setattr(provider, 'journal_trust', lambda home: HookTrust.READY)
    real_program_states(story)
    return story


def set_split(story, shares='claude 80,codex 20', viewer=None):
    with (viewer_client(story) if viewer is None else nullcontext(viewer)) as person:
        person.value('settings.settings', ['setting', 'set', SPLIT, shares, '--project'])


def dispatch(story, tasks='1', flags='', actor=None):
    worker_id = story.new_row_id(f'worker dispatch --test-command python=pytest {tasks} {flags}', actor=actor or story.agent)
    return Actor(worker_id, ActorType.AGENT)


def expect_program(story, worker, program, model=''):
    story.expect_text(f'agent show {agent_number(story, worker.id)}', f'program: {program}', *([f'program_model: {model}'] if model else []))


def new_task(story, title, flags=''):
    return story.new_row_id(f'task make "{title}" --brief "Implement {title}" --environment main {flags}', actor=story.agent)


def outage(story, program='codex', minutes=15, reason='it hit a rate limit'):
    ends_at = (story.clock.timestamp().value + timedelta(minutes=minutes)).isoformat(timespec="microseconds")
    row_id = story.new_row_id(f'provider-outage make {program} "{reason}" --ends-at {ends_at}', actor=story.agent)
    return row_id, ends_at


def exit_program(story, worker, code=1, text='API Error: 429 rate limit reached'):
    terminal = story.home.terminal_file(worker.id)
    terminal.parent.mkdir(parents=True, exist_ok=True)
    terminal.write_text(text)
    story.expect_success(f'agent exited {worker.id} {code}')
    story.run_listeners()


def real_program_checks(story):
    for provider in story.container.get(Providers).all():
        provider.__dict__.pop('journal_trust', None)
    story.container.bind(HelperPrograms, story.container.constructed(HelperPrograms))
    real_program_states(story)


class SplitViewer:
    def __init__(self, server, cookie):
        self.server, self.cookie = server, cookie

    def value(self, window_id, line):
        return self.server.viewer_line_value(self.cookie, {'window': window_id, 'environment': 'main', 'line': line})

    def refusal(self, window_id, line, reason):
        body = {"window": window_id, "environment": "main", "line": line}
        self.server.story.steps.append(f"viewer line {json.dumps(body, sort_keys=True)}")
        status, _, answer = viewer_answer(self.server.viewer_port(), "/api/line", self.cookie, "", body)
        response = json.loads(answer)
        assert status == 200 and response["code"] == 1 and reason in response["error"], (status, response)


@contextmanager
def viewer_client(story):
    with patch.object(Clock, "timestamp", story.clock.timestamp), server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key('Ada'))
        yield SplitViewer(server, cookie)


@pytest.fixture
def split_viewer(split_story):
    with viewer_client(split_story) as viewer:
        yield viewer


def uninstall_sample_module(story):
    modules = json.loads(story.home.module_list.read_text())
    story.home.module_list.write_text(json.dumps([module for module in modules if module != SAMPLE_MODULE]))
    code, output = story.synced()
    assert code == 0, output
