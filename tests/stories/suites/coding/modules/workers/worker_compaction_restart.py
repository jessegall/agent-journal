import json
from datetime import timedelta

from core.base.journal_home import LAUNCHER_SOCKET
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS
from core.testing.fake_launcher import FakeLauncher
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.suites.coding.modules.workers.worker_context_limit import JOB, LIMIT, compacting_worker, ended_worker, has_context, launched
from tests.stories.suites.coding.modules.workers.context_limit import typing_recorded

CODEX_SESSION = "codex-limit"
CODEX_TOKENS = LIMIT + 50_000
CODEX_WINDOW = 475_000
STOPS = 3
TOO_LONG = timedelta(seconds=601)


def restarted(story):
    code, text = story.synced()
    story.expect_rows(code == 0, detail=text)


def test_h3_a_worker_compacted_before_its_job_is_not_compacted_a_second_time_after_the_journal_restarts(compacting_worker):
    story, worker, launcher = compacting_worker
    restarted(story)
    launcher.server.close()
    story.home.socket(LAUNCHER_SOCKET).unlink()
    has_context(story, worker, LIMIT)
    following = FakeLauncher(story.home.socket(LAUNCHER_SOCKET))
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.run_listeners()
    following.drain_requests()
    command = launched(following, 0) if following.requests else ""
    story.expect_rows("/compact" not in command, JOB in command, detail=command or "the worker was not sent on after the restart")


def codex_rollout(story, monkeypatch):
    monkeypatch.setenv("CODEX_HOME", str(story.home.folder / "codex"))
    rollout = story.home.folder / "codex" / "sessions" / "2026" / "11" / "06" / f"rollout-2026-11-06T18-31-51-{CODEX_SESSION}.jsonl"
    rollout.parent.mkdir(parents=True)
    count = {"type": "event_msg", "payload": {"type": "token_count", "info": {"last_token_usage": {"input_tokens": CODEX_TOKENS, "total_tokens": CODEX_TOKENS + 390}, "model_context_window": CODEX_WINDOW}}}
    rollout.write_text(json.dumps(count) + "\n")


def test_h6_a_codex_agent_over_the_limit_types_nothing_runs_no_failing_command_at_each_stop_and_is_still_told(new_story, monkeypatch):
    story = typing_recorded(new_story(fixture=UserBuilder))
    story.expect_success(f"setting set {CONTEXT_LIMIT_ENABLED} true --project", actor=story.user)
    story.expect_success(f"setting set {CONTEXT_LIMIT_TOKENS} {LIMIT} --project", actor=story.user)
    story.new_row_id(f"agent start {CODEX_SESSION} codex worker --environment main")
    codex_rollout(story, monkeypatch)
    told = []
    for _ in range(STOPS):
        told += story.hook(CODEX_SESSION, HookSamples.stop().with_fields(program="codex")).lines
        story.advance(TOO_LONG)
    story.expect_rows(story.typing.typed == [], len(story.refusals()) == 0, any("passed the limit" in line for line in told), detail=f"typed {story.typing.typed}, refusals {len(story.refusals())}, told {told}")
