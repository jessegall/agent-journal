import json
from pathlib import Path

from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value_with


def test_task_info_prints_the_delegating_facts_and_no_brief(new_story):
    story = new_story(fixture=UserJoined)
    cart = story.new_row_id('task make "Fix the cart" --environment main --brief "The total adds up wrongly in the cart" --complexity 4 --tag cart --confirm', actor=story.agent)
    totals = story.new_row_id('task make "Fix the totals" --environment main', actor=story.agent)
    story.run(f"task-dependency make {cart} {totals}", actor=story.agent)
    story.expect_success(f'task comment {cart} "Look at rounding" --environment main', actor=story.user)
    text = story.run(f"task info {cart}", actor=story.agent).output_text
    for line in (f"task {cart}: Fix the cart", "state: blocked", "priority: ", "complexity: 4", "tags: cart", "comments: 1", "delegated to: nobody", f"waits on: task {totals} (open)"):
        expect_value_with(text, line)
    assert "The total adds up" not in text, text
    assert "Look at rounding" not in text, text


def test_task_info_in_json_names_each_field_and_holds_no_brief(new_story):
    story = new_story(fixture=UserJoined)
    task = story.new_row_id('task make "Fix the cart" --environment main --brief "Hidden brief" --complexity 2', actor=story.agent)
    answer = json.loads(story.run(f"task info {task} --json", actor=story.agent).output_text)
    assert answer["title"] == "Fix the cart" and answer["complexity"] == 2 and answer["comments"] == 0 and answer["delegated_to"] is None, answer
    assert set(answer) == {"id", "title", "state", "priority", "complexity", "tags", "comments", "delegated_to", "waits"}, answer


def test_task_info_says_a_task_has_no_score_yet(new_story):
    story = new_story(fixture=UserJoined)
    task = story.new_row_id('task make "Fix the cart" --environment main', actor=story.agent)
    story.expect_text(f"task info {task}", "complexity: not scored", "waits on: nothing", actor=story.agent)


def test_a_task_list_shows_the_complexity_without_a_column_option(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --environment main --complexity 5', actor=story.agent)
    line = next(line for line in story.run("task list", actor=story.agent).output_text.splitlines() if "Fix the cart" in line)
    assert line.split()[-1] == "5" or "5" in line.split(), line


def test_the_overview_shows_the_complexity_of_each_task(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --environment main --complexity 4', actor=story.user)
    text = story.run("overview", actor=story.user).output_text
    line = next(line for line in text.splitlines() if "Fix the cart" in line)
    assert line.split()[-1] == "4", line


def test_the_task_and_worker_skills_tell_a_delegating_agent_to_read_task_info_and_choose_the_model_from_the_complexity():
    source = Path(__file__).resolve().parents[5] / "src"
    tasks = (source / "core/modules/tasks/skills/journal-tasks/SKILL.md").read_text()
    workers = (source / "suites/coding/modules/workers/skills/journal-workers/SKILL.md").read_text()
    expect_value_with(tasks, "journal task info <n>")
    expect_value_with(workers, "journal task info <n>")
    expect_value_with(workers, "Choose the model from its complexity")
