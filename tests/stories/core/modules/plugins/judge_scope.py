import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.plugins.support.judge_scope_plugin import judge_scope_plugin_folder
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session

PROGRAM = "commandments-release"
HOLD_LIMIT_SETTING = "journal.core.plugins.hold_window_ms"
REASON ="a worker judges only its own work"


def judging(*arguments: str):
    line = " ".join([PROGRAM, "judge", *arguments])
    return HookSamples.shell(line, ShellPart(PROGRAM, CommandCategory.READ, ["judge", *arguments]))


@pytest.fixture
def judge_story(new_story):
    story = install_runner(new_story(fixture=OpenTaskOrchestrator))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"plugin install {judge_scope_plugin_folder(story.home.folder.parent)} --yes", actor=story.user)
    story.expect_success(f"setting set {HOLD_LIMIT_SETTING} 5000 --project", actor=story.user)
    repository_environment(story)
    story.worker = dispatched_worker(story)
    story.worker_session = worker_session(story, story.worker)
    return story


def test_a_worker_judging_the_whole_project_is_refused(judge_story):
    story = judge_story
    story.expect_hook_refusal(story.worker_session, judging(), "plugin:")
    story.expect_text(f"agent-line list --agent {story.worker.id}", f"[plugin judge-scope] {REASON}", actor=story.worker)
    story.expect_hook_allowed(story.worker_session, judging("--changes"))


def test_the_main_agent_judging_the_whole_project_is_let_through(judge_story):
    story = judge_story
    story.expect_hook_allowed("s-1", judging())
