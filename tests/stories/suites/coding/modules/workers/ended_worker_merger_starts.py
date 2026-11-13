from engine.scope.scopes import Scopes
from suites.coding.modules.workers.models.merge_ask import MergeAsk
from suites.coding.modules.workers.support.escalations import Escalations
from suites.coding.modules.workers.support.merger_work import MergerWork
from suites.coding.modules.workers.ticks.merger_retry import MergerRetry
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.free_commits import ASK_MERGE
from tests.stories.suites.coding.modules.workers.merge_asks import committed_list
from tests.stories.suites.coding.modules.workers.merger import merger_agent
from tests.stories.suites.coding.modules.workers.stopped_with_tasks import MERGER_ON
from tests.stories.suites.coding.modules.workers.support.merger_launcher import merger_can_start, running_launcher
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED

MERGER_OFF = f"setting set {MERGER_ENABLED} false --project"
QUESTION = 'worker ask "the build tool is missing" --about tool'


def merger_has_work(story) -> bool:
    with story.container.get(Scopes).read_scope((), None, 1):
        return story.container.get(MergerWork).has_waiting_work()


def is_with_main_agent(story, worker_id: int) -> bool:
    with story.container.get(Scopes).read_scope((), None, 1):
        return story.container.get(Escalations).is_open(worker_id)


def test_an_ended_worker_whose_question_the_main_agent_holds_starts_no_merger_for_its_waiting_ask_until_the_main_agent_writes_to_it(new_story, monkeypatch):
    worker = committed_list(new_story, monkeypatch)
    story = worker.story
    story.expect_success(MERGER_OFF, actor=story.user)
    story.expect_success(QUESTION, actor=worker.worker)
    story.expect_success(ASK_MERGE, actor=worker.worker)
    worker.program_ended()
    story.expect_success(MERGER_ON, actor=story.user)
    asks = [ask.state.value for ask in story.story_rows(MergeAsk)]
    story.expect_rows(asks == ["waiting"], is_with_main_agent(story, worker.worker.id), detail=f"asks {asks}")
    merger_can_start(monkeypatch)
    with running_launcher(story):
        for _ in range(3):
            MergerRetry()(story.container)
            story.run_listeners()
        story.expect_rows(not merger_has_work(story), merger_agent(story) is None, detail="the main agent holds the ended worker's question, so the merger could not act on its ask")
    story.expect_success(f'message send "the build tool is installed now" --to agent:{agent_number(story, worker.worker.id)}', actor=story.agent)
    story.expect_rows(not is_with_main_agent(story, worker.worker.id), merger_has_work(story), detail="once the main agent wrote to the worker, the merger has its ask to merge")
