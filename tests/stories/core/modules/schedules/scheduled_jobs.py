from tests.stories.core.support.agent_labels import agent_number
from engine.testing.stories.story_fixture import StoryFixture

from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.registry.registry import Registry
from engine.registry.suite_windows import SuiteWindows
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

JOB = "1a2b3c4d"
CRON = "*/10 * * * *"


def cron_hook(tool: str, fields: dict, answer: str = ""):
    return HookSamples.sample("post_tool_use", {"name": tool, "category": "other", "files": [], "diff": None}).with_raw({"tool_input": fields, "tool_response": answer})


class ScheduledBuildJob(StoryFixture):
    parent = BuilderStarted
    recurring = True

    def steps(self, story):
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
        story.hook('s-1', cron_hook('CronCreate', {'cron': CRON, 'prompt': 'Check the build\nand say', 'recurring': self.recurring}, f'Scheduled job {JOB}, next run soon'))


class OneTimeBuildJob(ScheduledBuildJob):
    recurring = False


def running(story) -> str:
    return f"scheduled-job running --agent {agent_number(story, story.agent.id)}"


def test_a_job_an_agent_schedules_is_listed_with_its_schedule(new_story):
    story = new_story(fixture=ScheduledBuildJob)
    story.expect_text(running(story), f"{JOB} {CRON}: Check the build")


def test_a_job_the_agent_deletes_leaves_the_list(new_story):
    story = new_story(fixture=ScheduledBuildJob)
    story.hook("s-1", cron_hook("CronDelete", {"id": JOB}))
    story.expect_absent(running(story), JOB)


def test_a_schedule_whose_answer_names_no_job_records_nothing(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", cron_hook("CronCreate", {"cron": CRON, "prompt": "Check"}, "the schedule was refused"))
    story.expect_text(running(story), "no scheduled jobs")


def test_stopping_tells_the_agent_to_delete_it_and_it_stays_until_it_has(new_story):
    story = new_story(fixture=ScheduledBuildJob)
    story.expect_success("scheduled-job stop 1", actor=story.user)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"delete it with CronDelete, id {JOB}", actor=story.user)
    story.expect_text(running(story), JOB)
    story.hook("s-1", cron_hook("CronDelete", {"id": JOB}))
    story.expect_absent(running(story), JOB)
    story.expect_refusal("scheduled-job stop 1", "has ended already", actor=story.user)


def test_an_agent_stops_a_job(new_story):
    story = new_story(fixture=ScheduledBuildJob)
    story.expect_success("scheduled-job stop 1", actor=story.agent)


def test_an_ended_agent_lists_no_jobs_and_lists_them_again_once_its_session_resumes(new_story):
    story = new_story(fixture=ScheduledBuildJob)
    story.expect_success(f"agent end {story.agent.id}", actor=story.user)
    story.expect_absent(running(story), JOB)
    story.hook("s-1", HookSamples.session_start())
    story.expect_text(running(story), JOB)


def test_a_repeating_job_lapses_after_seven_days_and_a_single_one_does_not(new_story):
    story = new_story(fixture=ScheduledBuildJob)
    story.hook("s-1", cron_hook("CronCreate", {"cron": "0 9 2 11 *", "prompt": "Once", "recurring": False}, "Scheduled job 9f8e7d6c"))
    story.advance(timedelta(days=8))
    story.expect_absent(running(story), JOB)
    story.expect_text(running(story), "9f8e7d6c")


def test_the_agent_bars_windows_are_offered_by_the_coding_suite(new_story):
    story = new_story(fixture=BuilderStarted)
    windows = {window.name for window in SuiteWindows(story.container.get(Registry)).windows("coding")}
    story.expect_rows({"schedules.jobs", "workers.workers"} <= windows)


def test_a_prompt_that_is_a_jobs_words_is_its_run_and_shows_a_mark(new_story):
    story = new_story(fixture=ScheduledBuildJob)
    story.hook("s-1", HookSamples.prompt("something else"))
    story.run_listeners()
    story.expect_absent("chat-mark list --environment 1", "schedules.job-run")
    story.hook("s-1", HookSamples.prompt("Check the build\nand say"))
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1", f"Scheduled job {JOB} ran")
    story.expect_text(f"scheduled-job show 1", "last_run_at: 2026", actor=story.user)


def test_a_job_that_does_not_repeat_ends_with_its_run(new_story):
    story = new_story(fixture=OneTimeBuildJob)
    story.hook("s-1", HookSamples.prompt("Check the build\nand say"))
    story.expect_text(f"scheduled-job show 1", "ended_at: 2026", actor=story.user)
