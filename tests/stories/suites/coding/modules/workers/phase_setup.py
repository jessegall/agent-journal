from tests.stories.suites.coding.modules.workers.support.phase_steps import worker_on_plan


def test_a_worker_dispatched_on_a_plan_holds_its_first_task_and_the_plan_is_started(new_story, monkeypatch):
    on_plan = worker_on_plan(new_story, monkeypatch)
    on_plan.story.expect_text("task show 1", "state: started", f"holder_id: {on_plan.worker.id}", actor=on_plan.story.agent)
    on_plan.story.expect_text("plan show 1", "state: started", actor=on_plan.story.agent)
