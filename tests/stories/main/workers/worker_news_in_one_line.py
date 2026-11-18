from journal.features.workers.states.orchestrating import Orchestrating
from journal.features.workers.workers_nudges import WorkersNudges
from journal.features.workers.workers_options import ORCHESTRATOR_MODE, WorkersOptions
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import setting, story
from tests.stories.fixtures.main.orchestrator_worker import OrchestratorWorker
from tests.stories.fixtures.main.orchestrator_worker_delivered import OrchestratorWorkerDelivered

NEWS_SECONDS = 300
# a clock tick, past the five seconds the journal's clock waits between two
TICK_SECONDS = 5


@story(OrchestratorWorker, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(WorkersOptions.DIGEST_SECONDS, NEWS_SECONDS)
def test_with_the_news_on_a_clock_out_is_not_told_at_once_and_the_next_tick_names_it_in_the_one_line(story):
    story.agent_proves(story.agents.workers.first(), 1, "parser.py:12, test_reads passes")
    story.agent_proves(story.agents.workers.first(), 2, "parser.py:30, test_names passes")
    result = story.agent_clocks_out(story.agents.workers.first(), "the parser is done")
    result.expect_agent_not_told(story.agents.subject, WorkersNudges.WORK_READY)
    result = story.clock_ticks(TICK_SECONDS)
    result.expect_agent_told(story.agents.subject, WorkersNudges.WORKER_NEWS, span="5 min", needs=f"worker {story.agents.workers.first()} ready")
    result = story.clock_ticks(TICK_SECONDS)
    result.expect_agent_not_told(story.agents.subject, WorkersNudges.WORKER_NEWS)
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorWorker, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
def test_with_the_news_off_a_clock_out_is_told_at_once_and_the_tick_gives_no_news_line(story):
    story.agent_proves(story.agents.workers.first(), 1, "parser.py:12, test_reads passes")
    story.agent_proves(story.agents.workers.first(), 2, "parser.py:30, test_names passes")
    result = story.agent_clocks_out(story.agents.workers.first(), "the parser is done")
    result.expect_agent_told(story.agents.subject, WorkersNudges.WORK_READY)
    result = story.clock_ticks(TICK_SECONDS)
    result.expect_agent_not_told(story.agents.subject, WorkersNudges.WORKER_NEWS)
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorWorkerDelivered, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(WorkersOptions.DIGEST_SECONDS, NEWS_SECONDS)
def test_with_the_news_on_a_merge_leaves_the_idle_worker_untold_and_is_counted_in_the_one_line(story):
    story.agent_runs(story.agents.subject, f"worker check {story.agents.workers.first()} 1")
    story.agent_runs(story.agents.subject, f"worker check {story.agents.workers.first()} 2")
    result = story.agent_runs(story.agents.subject, f"worker merge {story.agents.workers.first()}")
    result.expect_agent_not_told(story.agents.subject, WorkersNudges.IDLE_WORKER)
    result = story.clock_ticks(TICK_SECONDS)
    result.expect_agent_told(story.agents.subject, WorkersNudges.WORKER_NEWS, counts="1 merged, 0 sent back, 1 dispatched", needs="nothing")
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorWorker, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(WorkersOptions.DIGEST_SECONDS, NEWS_SECONDS)
def test_with_the_news_on_a_stop_is_not_held_for_a_worker_only_still_out(story):
    result = story.agent_stops(story.agents.subject)
    result.expect_agent_not_told(story.agents.subject, WorkersNudges.ACTIVE_WORKERS)
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorWorker, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(WorkersOptions.DIGEST_SECONDS, NEWS_SECONDS)
def test_with_the_news_on_a_report_is_not_told_nor_reminded_and_the_one_line_names_it(story):
    result = story.agent_runs(story.agents.workers.first(), f"worker report {story.agents.workers.first()} 'the grammar is ambiguous'")
    result.expect_agent_not_told(story.agents.subject, WorkersNudges.WORKER_REPORTED)
    result = story.clock_ticks(TICK_SECONDS)
    result.expect_agent_not_told(story.agents.subject, WorkersNudges.UNREAD_WORKER_REPORTS)
    result.expect_agent_told(story.agents.subject, WorkersNudges.WORKER_NEWS, needs=f"worker {story.agents.workers.first()} reported")
    story.expect_stack(story.agents.subject, Orchestrating)
