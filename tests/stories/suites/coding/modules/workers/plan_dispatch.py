import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.chat.models.chat_mark import ChatMark
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from tests.stories.core.modules.chat.support.mark_samples import expect_absent_marks_text, expect_marks_text
from tests.stories.suites.coding.modules.workers.support.phase_steps import planned_story
from tests.integration.suites.coding.modules.workers.test_test_queue import recording_launch



def read_outline(story) -> dict:
    return json.loads(story.run("plan outline 1 --json", actor=story.agent).output_text)


def expect_queued(outline, task_id, agent_id) -> None:
    task = [task for phase in outline["phases"] for task in phase["tasks"] if task["id"] == task_id][0]
    actual = (task["state"], task["helper_id"], bool(task["helper_name"]))
    assert actual == ("open", agent_id, True), actual


def expect_agents(outline, expected) -> None:
    actual = (outline["delegated"], [(agent["task_id"], bool(agent["name"])) for agent in outline["agents"]])
    assert actual == expected, actual






def test_a_dispatch_for_a_plan_that_is_only_a_draft_is_refused(new_story):
    story = planned_story(new_story, approve=False)
    story.expect_refusal("worker dispatch --test-command python=pytest --model sonnet --plan 1", "plan 1 is draft", actor=story.agent)




