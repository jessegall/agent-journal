import json

import pytest

from core.base.database.database import Database
from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment


@pytest.fixture
def forty_task_inspector(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    repository_environment(story)
    worker = dispatched_worker(story).id
    story.new_row_id('agent start unrelated-worker codex worker --environment main')
    for number in range(39):
        task = story.new_row_id(f'task make "Inspector task {number}" --brief "Details that are not shown on the agent card" --environment main', actor=story.agent)
        story.expect_success(f'task assign {task} --to {worker}', actor=story.agent)
        story.expect_success(f'task log {task} "History that is not shown on the agent card"', actor=story.agent)
    with server_story(story, listener_thread_started=False) as server:
        yield server, server.expect_viewer_login(server.viewer_key('Ada')), worker


def test_inspector_facts_select_one_agent(forty_task_inspector):
    server, cookie, worker = forty_task_inspector
    answer = server.viewer_line_value(cookie, {'window': 'viewer.shell', 'environment': 'main',
                                              'line': ['usage', 'agents', '--closed', '--agent', str(worker)]})
    server.story.expect_rows([row['id'] for row in answer['rows']] == [worker], len(answer['rows'][0]['tasks']) == 40)


def test_inspector_card_keeps_its_read_budget(forty_task_inspector, monkeypatch):
    server, cookie, worker = forty_task_inspector
    loaded = []
    original = Database.rows

    def measured_rows(database, statement):
        rows = original(database, statement)
        loaded.append((statement.sql, len(rows)))
        return rows

    monkeypatch.setattr(Database, 'rows', measured_rows)
    status, answer = window_data(server, cookie, keys=f'card.{worker}', window='agents.agents')
    row = answer['keys'][f'card.{worker}']['value']['rows'][0]
    server.story.expect_rows(status == 200, len(row['facts']['tasks']) == 40,
                             sum(count for _, count in loaded) <= 150,
                             len(json.dumps(answer).encode()) <= 40_000,
                             not any('FROM task_logs' in sql or 'FROM outputs' in sql for sql, _ in loaded),
                             detail=str([(sql[:100], count) for sql, count in loaded]))
