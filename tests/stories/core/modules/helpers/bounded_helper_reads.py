from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.agents.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.drivers.agent_pause import FakeTyping
from tests.stories.core.modules.helpers.helper_jobs import START, EndedHelper, helper_agent
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.large_reads import seeded_children, seeded_finished_jobs
from tests.stories.core.support.read_limit import limit_reads

"""Book 3 of doc 1255: the helper reads that grew past the read limit give the same answer on a few rows and read
at most 51 rows in a statement on many."""

OTHER_FILES_START = 'helper start journal-researcher --brief "Read src/queue.py" --environment main'
COSTS = "helper lifetimes journal-researcher --environment main"


def test_helper_start_still_reuses_a_helper_whose_finished_job_mentions_the_same_path(new_story):
    story = new_story(fixture=EndedHelper)
    FakeLauncher.listening(story.home.socket("launcher"))
    story.expect_refusal(START, "knows these files", actor=story.agent)


def test_helper_send_asks_for_an_open_job_of_one_helper_and_reads_one_row(new_story):
    story = new_story(fixture=EndedHelper)
    seeded_finished_jobs(story, story.agent.id, helper_agent(story).id, 300)
    limit_reads(story)
    FakeLauncher.listening(story.home.socket("launcher"))
    story.expect_success(OTHER_FILES_START, actor=story.agent)


def test_job_costs_use_the_newest_fifty_finished_jobs_and_give_the_same_estimate_on_few_jobs(new_story):
    story = new_story(fixture=EndedHelper)
    story.expect_text(COSTS, "1 jobs on a new session", "0 jobs on a resumed session", actor=story.user)
    seeded_finished_jobs(story, story.agent.id, helper_agent(story).id, 1200)
    limit_reads(story)
    story.expect_text(COSTS, "50 jobs on a new session", "0 jobs on a resumed session", actor=story.user)


def test_agent_resume_reads_only_the_running_children_with_a_filter(new_story):
    story = new_story(fixture=EndedHelper)
    seeded_children(story, story.agent.id, 120)
    story.bind(TerminalTyping, FakeTyping())
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.user)
    limit_reads(story)
    story.expect_success(f"agent resume {agent_number(story, story.agent.id)}", actor=story.user)
