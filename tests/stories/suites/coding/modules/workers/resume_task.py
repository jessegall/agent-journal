from datetime import timedelta
import json
import shlex

import pytest

from core.base.file_access import FileAccess
from core.base.journal_home import LAUNCHER_SOCKET
from core.base.json_settings import JsonSettings
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.testing.fake_launcher import FakeLauncher
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository


@pytest.mark.parametrize(("program", "model"), [("claude", "sonnet"), ("codex", "gpt-6.1-sol")])
@pytest.mark.parametrize("merged", [False, True], ids=["open-worktree", "merged-worktree"])
def test_a_task_sent_to_a_stopped_worker_resumes_it_once(new_story, program, model, merged):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = GitRepository.sample(story.home.project_folder)
    story.expect_success(f"environment edit 1 --folder {shlex.quote(str(repository.folder))} --branch {ENVIRONMENT_BRANCH}")
    worker = checked_worker(story, repository, f"worker dispatch --program {program} --model {model} 1")
    if merged:
        repository.checkout(ENVIRONMENT_BRANCH)
        story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    else:
        story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.run_listeners()
    story.advance(timedelta(seconds=1))
    task_id = story.new_row_id('task make "The next task" --brief "Keep the total in cents"', actor=story.agent)
    if merged:
        path = repository.folder / ".codex/hooks.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(path, json.dumps({"hooks": {}}))
        JsonSettings.loaded.cache_clear()
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET), answer=b"started 123456789\n", request_count=2)
    try:
        story.expect_success(f"worker send {worker.id} --task {task_id}", actor=story.agent)
        story.run_listeners()
        story.expect_rows(len(launcher.starts) == 1)
        launch = launcher.starts[0]
        story.expect_rows(launch["session"] == worker_session(story, worker))
        story.expect_rows("--resume" in launch["command"] or "resume" in launch["command"])
        story.expect_rows(any(f"task overview {task_id}" in argument for argument in launch["command"]))
        job = story.container.get(Queries).query(AgentLine).filter(session_agent_id=worker.id, source=WORKER_JOB_SOURCE).newest().first()
        story.expect_rows(job.state is AgentLineState.ENTERED)
        story.expect_rows(story.row(Agent, worker.id).ended_at is None)
    finally:
        launcher.server.close()
