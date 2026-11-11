import json
from dataclasses import fields

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.event.event_log import EventLog
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.model.view_model import ViewModel
from engine.module.module_finder import ModuleFinder
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.task import Task
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import SEVERAL_ENVIRONMENTS, StoryFixture
from tests.stories.engine.driver.support.hook_agents import hook_agent
from tests.stories.core.support.coding_fixtures import UserBuilder

MAIN_TASK = 1
STAGING_TASK = 2
MAIN_TITLE = "Main release"
STAGING_TITLE = "Staging release"
STATED_EXCEPTIONS = {"Setting", "SecretSetting", "Reader", "JournalException", "PluginDelivery", "PluginOutput", "PluginSetting"}


def staging_agent(story):
    return Actor(story.container.get(Queries).query(Agent).filter(session="s-2").first().id, ActorType.AGENT)


def staging_worker(story):
    return Actor(story.new_row_id("agent start s-3 claude worker --environment staging"), ActorType.AGENT)


class TwoWorkingEnvironments(StoryFixture):
    """Environment main with its main agent and task 1; environment staging with session s-2 and task 2."""

    parent = UserBuilder
    environment = SEVERAL_ENVIRONMENTS

    def steps(self, story):
        story.run("environment make staging /work/staging")
        story.run("suite choose coding --environment staging")
        hook_agent(story, story.hook("s-2", HookSamples.session_start().with_fields(environment="staging")))
        story.run(f'task make "{MAIN_TITLE}" --environment main', actor=story.agent)
        story.run(f'task make "{STAGING_TITLE}" --environment staging', actor=staging_agent(story))

    def expect(self, story):
        story.expect_success(f"task show {MAIN_TASK}", "environment_id: 1")
        story.expect_success(f"task show {STAGING_TASK}", "environment_id: 2")


def test_an_agent_lists_only_the_tasks_of_its_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.expect_text("task list", MAIN_TITLE, actor=story.agent)
    story.expect_no_text("task list", STAGING_TITLE, actor=story.agent)


def test_an_agent_cannot_show_a_task_of_another_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.expect_refusal(f"task show {STAGING_TASK}", "no task", actor=story.agent)


def test_an_agent_cannot_change_a_task_of_another_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.expect_refusal(f'task edit {STAGING_TASK} --title "Changed"', "no task", actor=story.agent)


def test_an_agent_cannot_start_a_task_of_another_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.expect_refusal(f"task start {STAGING_TASK}", "no task", actor=story.agent)


def test_a_task_cannot_depend_on_a_task_of_another_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.expect_refusal(f"task depend {MAIN_TASK} --on {STAGING_TASK}", "no task", actor=story.agent)


def test_a_worker_reads_the_tasks_of_its_own_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    worker = staging_worker(story)
    story.expect_text("task list", STAGING_TITLE, actor=worker)
    story.expect_no_text("task list", MAIN_TITLE, actor=worker)


def test_a_new_row_of_an_agent_lands_in_its_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    task_id = story.new_row_id('task make "Third"', staging_agent(story))
    story.expect_rows(story.row(Task, task_id).environment_id == 2)


def test_an_agent_that_names_another_environment_is_refused(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.expect_refusal('task make "Third" --environment main', "only in its own environment", actor=staging_agent(story))


def test_an_agent_that_names_its_own_environment_goes_on(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    task_id = story.new_row_id('task make "Third" --environment staging', staging_agent(story))
    story.expect_rows(story.row(Task, task_id).environment_id == 2)


def test_a_person_s_new_row_lands_in_the_environment_of_the_request(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    task_id = story.new_row_id('task make "Third" --environment staging', story.user)
    story.expect_rows(story.row(Task, task_id).environment_id == 2)


def test_a_person_with_no_environment_cannot_make_a_row_that_needs_one(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.expect_refusal('task make "Third"', "a task needs an environment", actor=story.user)


def test_a_write_to_an_unknown_environment_is_refused(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.expect_refusal('task make "Third" --environment nowhere', "nowhere", actor=story.user)


def test_a_person_with_no_environment_lists_every_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.expect_text("task list", MAIN_TITLE, STAGING_TITLE, actor=story.user)


def test_a_person_s_board_holds_only_the_environment_it_names(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.expect_text("task board --environment staging --json", STAGING_TITLE, actor=story.user)
    story.expect_no_text("task board --environment staging --json", MAIN_TITLE, actor=story.user)


def test_plans_stay_in_their_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.run('plan make "Staging plan"', actor=staging_agent(story))
    story.expect_text("plan list", "Staging plan", actor=staging_agent(story))
    story.expect_no_text("plan list", "Staging plan", actor=story.agent)


def test_questions_stay_in_their_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.run('question ask "Ship staging?" --context "A story asks this so its card and answer can be checked."', actor=staging_agent(story))
    story.expect_text("question list", "Ship staging?", actor=staging_agent(story))
    story.expect_no_text("question list", "Ship staging?", actor=story.agent)


def test_a_message_of_a_person_reaches_only_the_agent_of_that_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.run('message send "Hello staging" --environment staging', actor=story.user)
    story.expect_text("message unread", "Hello staging", actor=staging_agent(story))
    story.expect_no_text("message unread", "Hello staging", actor=story.agent)


def test_pins_stay_in_their_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.run('pin make "Staging docs" --link "https://example.com/staging" --label "Open"', actor=staging_agent(story))
    story.expect_text("pin list", "Staging docs", actor=staging_agent(story))
    story.expect_no_text("pin list", "Staging docs", actor=story.agent)


def test_a_search_finds_no_row_of_another_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.expect_text(f'search find "{STAGING_TITLE}"', STAGING_TITLE, actor=staging_agent(story))
    story.expect_no_text(f'search find "{STAGING_TITLE}"', f"{STAGING_TASK}: {STAGING_TITLE}", actor=story.agent)


def test_an_agent_lists_only_the_agents_of_its_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.expect_text("agent list", "s-1", actor=story.agent)
    story.expect_no_text("agent list", "s-2", actor=story.agent)


def test_every_environment_with_a_running_agent_is_named_to_an_agent(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.expect_text("agent environments --json", "[1, 2]", actor=story.agent)


def test_environments_are_listed_from_inside_an_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.expect_text("environment list", "main", "staging", actor=story.agent)


def test_a_setting_of_the_whole_project_holds_in_every_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.run("setting set journal.core.processes.run-batch-size 7 --project", actor=story.user)
    story.expect_text("setting show journal.core.processes.run-batch-size", "7", actor=story.agent)
    story.expect_text("setting show journal.core.processes.run-batch-size", "7", actor=staging_agent(story))


def test_a_setting_of_one_environment_holds_only_there(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.run("setting set journal.core.processes.run-batch-size 7 --environment staging", actor=story.user)
    story.expect_text("setting show journal.core.processes.run-batch-size", "7", actor=staging_agent(story))
    story.expect_no_text("setting show journal.core.processes.run-batch-size", "value: 7", actor=story.agent)


def test_a_project_rule_of_one_environment_is_read_in_another(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.run('rule make "Always write tests" --environment main', actor=story.user)
    story.expect_text("rule list", "Always write tests", actor=staging_agent(story))


def test_a_listener_of_a_person_s_write_works_in_the_environment_of_the_row(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.run(f"task block {STAGING_TASK} --reason Waiting --environment staging", actor=story.user)
    story.run_listeners()
    story.expect_text("message feed --environment staging --json", '"rows"', actor=story.user)
    story.expect_no_text("task list --state blocked", STAGING_TITLE, actor=story.agent)


def test_the_event_of_a_row_holds_the_environment_of_the_row_when_a_job_writes_it(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.run(f'task edit {STAGING_TASK} --title "Changed by a job"')
    log = story.container.get(EventLog)
    story.expect_rows(log.event(log.newest_id()).environment_id == 2)


def test_a_job_outside_any_request_reads_every_environment(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    titles = {task.title for task in story.story_rows(Task)}
    story.expect_rows(MAIN_TITLE in titles, STAGING_TITLE in titles)


def test_a_scoped_read_leaves_no_scope_behind_on_a_refusal(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.run(f"task show {MAIN_TASK} --environment staging", actor=story.user)
    story.expect_success(f"task show {MAIN_TASK}", "environment_id: 1")


def test_the_viewer_s_feed_stays_in_the_environment_of_the_line(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.run('message send "Hello staging" --environment staging', actor=story.user)
    story.run('message send "Hello main" --environment main', actor=story.user)
    rows = json.loads(story.run("message feed --environment staging --json", actor=story.user).output_text)["rows"]
    story.expect_rows(all(row["environment_id"] == 2 for row in rows), any(row["text"] == "Hello staging" for row in rows))


def row_classes(base):
    return [subclass for child in base.__subclasses__() for subclass in (child, *row_classes(child))]


def test_every_model_with_an_environment_declares_the_scope_or_is_a_stated_exception(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    story.container.get(ModuleFinder).modules()
    with_column = [row for row in (*row_classes(Model), *row_classes(ViewModel)) if "environment_id" in {field.name for field in fields(row)}]
    story.expect_rows({row.__name__ for row in with_column if not issubclass(row, EnvironmentScoped)} == STATED_EXCEPTIONS)
