from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.drivers.agent_pause import FakeTyping
from tests.stories.core.modules.drivers.refusal_skips import guard_skips
from tests.stories.core.modules.helpers.helper_jobs import START, EndedHelper, helper_agent
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.large_reads import seeded_children, seeded_finished_jobs
from tests.stories.core.support.read_limit import limit_reads
from tests.stories.core.support.seeds.large_read_seeds import AgentSkillSeed, RefusedHookCallSeed, SavedBuildSeed
from tests.stories.server.support.go_build import GoBuild
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

"""Story 27 of doc 1255: on a journal as large as the one that tripped the read limit, the commands whose reads were
fixed run with the limit on and cut no read; a cut or a statement over the limit fails the command under the story
kit."""

FINISHED_JOBS = 1200
SAVED_BUILDS = 336
OTHER_RULE_REFUSALS = 207
ENDED_CHILDREN = 120
SKILL_ROWS = 128
CONFLICTING_BUILD = 'alias add second-build "cd seeded/package_7 && make all" --category build'


class LargeJournal(StoryFixture):
    """A main agent with an ended helper, 1200 finished jobs, 336 saved builds, 207 calls refused by another rule,
    120 ended child helpers and 128 skill rows."""

    parent = EndedHelper

    def steps(self, story):
        seeded_finished_jobs(story, story.agent.id, helper_agent(story).id, FINISHED_JOBS)
        story.seed(SavedBuildSeed, SAVED_BUILDS)
        story.seed(RefusedHookCallSeed, OTHER_RULE_REFUSALS, session_agent_id=story.agent.id)
        seeded_children(story, story.agent.id, ENDED_CHILDREN)
        story.seed(AgentSkillSeed, SKILL_ROWS, session_agent_id=story.agent.id)


def built_hook(story) -> None:
    binary = story.home.folder / "bin" / "journal-hook"
    binary.parent.mkdir(parents=True, exist_ok=True)
    GoBuild.built("journal-hook", binary)


def test_helper_start_on_a_journal_with_1200_helper_jobs_makes_no_read_cut_report(new_story):
    story = new_story(fixture=LargeJournal)
    limit_reads(story)
    FakeLauncher.listening(story.home.socket("launcher"))
    story.expect_refusal(START, "knows these files", actor=story.agent)


def test_alias_edit_with_336_aliases_makes_no_read_cut_report(new_story):
    story = new_story(fixture=LargeJournal)
    built_hook(story)
    limit_reads(story)
    story.expect_refusal(CONFLICTING_BUILD, "this program and target already use journal seeded-build-7", actor=story.agent)


def test_refusal_skip_with_207_refused_calls_makes_no_read_cut_report(new_story):
    story = new_story(fixture=LargeJournal)
    limit_reads(story)
    guard_skips(story, story.agent, 2)


def test_agent_resume_with_many_ended_children_makes_no_read_cut_report(new_story):
    story = new_story(fixture=LargeJournal)
    story.bind(TerminalTyping, FakeTyping())
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.user)
    limit_reads(story)
    story.expect_success(f"agent resume {agent_number(story, story.agent.id)}", actor=story.user)


def test_agent_skill_unread_with_128_skill_rows_makes_no_read_cut_report(new_story):
    story = new_story(fixture=LargeJournal)
    limit_reads(story)
    story.expect_success(f"agent-skill unread {agent_number(story, story.agent.id)}")


def test_each_fixed_read_reads_at_most_51_rows_where_it_read_207_to_1000_before(new_story):
    story = new_story(fixture=LargeJournal)
    limit_reads(story)
    story.expect_text(f"helper lifetimes {RESEARCHER_PROFILE.name} --environment main", "50 jobs on a new session", actor=story.user)
    FakeLauncher.listening(story.home.socket("launcher"))
    story.expect_refusal(START, "knows these files", actor=story.agent)
    guard_skips(story, story.agent, 1)
