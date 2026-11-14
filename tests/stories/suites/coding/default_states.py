import json

from tests.stories.core.modules.drivers.support.default_state_modules import PATH
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import BuilderStartedWithoutPlainWords


def test_state_types_with_defaults_shows_what_the_coding_suite_gives_each_kind_of_agent(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    shown = story.run("driver state-types --defaults", actor=story.agent).output_text
    story.expect_rows("tasks.where-you-stand" in shown, "workers.worker-log-due" in shown, detail=shown)


def test_a_coding_main_agent_has_the_where_you_stand_default_at_the_bottom_of_its_states_and_nothing_is_written(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    shown = story.run(f"driver states {agent_number(story, story.agent.id)}", actor=story.agent).output_text
    in_place = next(line for line in shown.splitlines() if line.startswith("in_place:"))
    story.expect_rows("tasks.where-you-stand (agent:" in in_place and "since" in in_place, detail=shown)


def listed_types(story) -> dict[str, dict]:
    return {state["name"]: state for state in json.loads(story.run("driver state-types --json", actor=story.agent).output_text)["rows"]}


def test_a_worker_gets_the_worker_defaults_and_not_the_main_ones(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    worker = story.new_row_id(f"agent start s-2 claude worker --parent {story.agent.id} --environment main")
    shown = story.run(f"driver states {agent_number(story, worker)}", actor=story.agent).output_text
    story.expect_rows("workers.worker-log-due" in shown, "tasks.where-you-stand" not in shown, detail=shown)


def test_a_default_state_gates_no_rule_so_adding_it_changes_nothing(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    types = listed_types(story)
    story.expect_rows(types["tasks.where-you-stand"]["rules"] == "(none)", types["workers.worker-log-due"]["rules"] == "(none)", detail=str(types))


def test_a_joining_suite_adds_its_defaults_to_the_suite_it_joins(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    story.expect_sync_success(f"{PATH}:DefaultAdded")
    story.expect_text("driver state-types --defaults", "acme.default", actor=story.agent)


def test_a_default_naming_a_state_no_module_registers_is_refused_at_sync(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    story.expect_sync_refusal(f"{PATH}:DefaultNamingUnknownState", "which no module registers")


def test_a_default_given_to_a_kind_nothing_registers_is_refused_at_sync(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    story.expect_sync_refusal(f"{PATH}:DefaultNamingUnknownKind", "which nothing registers")
