import json

from engine.command.bus import Bus
from core.modules.processes.commands.end_process.end_process import EndProcess
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.processes.support.process_samples import start_process
from tests.stories.core.support.coding_fixtures import BriefedTaskBuilder
from tests.stories.core.support.fixtures import ThreeTasksPhase


def test_one_read_gives_what_the_inspector_adds_to_the_row_of_an_agent_with_a_task_and_no_plan(new_story):
    story = new_story(fixture=BriefedTaskBuilder)
    story.run("task start 1", actor=story.agent)
    story.hook("s-1", HookSamples.stop())
    story.expect_text(f"usage agent {story.agent.id}", f"agent {story.agent.id}, started by", "0 failed runs", actor=story.user)
    story.expect_text(f"usage agent {story.agent.id} --json", '"task": {"id": 1, "title": "Fix the cart"}', '"plan": null', '"failed_runs": 0', '"recent": []', actor=story.user)
    story.expect_text(f"usage agent {story.agent.id} --json", '"last_activity": "2026', actor=story.user)


def test_a_run_that_failed_is_counted_and_listed_as_a_bad_move(new_story):
    story = new_story(fixture=BriefedTaskBuilder)
    process = start_process(story, "make build")
    story.container.get(Bus).run(EndProcess(process.id, 1, 0, 0), story.agent, environment_id=1)
    story.expect_text(f"usage agent {story.agent.id} --json", '"failed_runs": 1', '"text": "A run failed: make build"', '"tone": "bad"', actor=story.user)


def test_the_task_an_agent_holds_shows_its_plan_with_the_phase_and_the_tasks_done(new_story):
    story = new_story(fixture=ThreeTasksPhase)
    story.run("task start 1", actor=story.agent)
    story.expect_text(f"usage agent {story.agent.id} --json", '"task": {"id": 1', '"title": "Version 5 core"', '"phase": 1', '"done": 0', '"total": 3')


def test_the_inspector_read_answers_all_an_agents_inspector_draws(new_story):
    story = new_story(fixture=BriefedTaskBuilder)
    story.run("task start 1", actor=story.agent)
    answer = json.loads(story.run(f"usage inspector {story.agent.id} --environment main --json", actor=story.user).output_text)
    story.expect_rows(answer["agent"]["id"] == story.agent.id, answer["facts"]["id"] == story.agent.id, answer["inspection"]["task"]["title"] == "Fix the cart",
                      answer["helpers"] == 0, answer["points"] == [], {program["name"] for program in answer["programs"]} >= {"claude"}, "tool" in answer["tool"])
