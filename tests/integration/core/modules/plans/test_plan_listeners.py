from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import PlanTasksPlaced
from tests.stories.core.support.plan_steps import ready_plan
from tests.stories.core.support.plans_samples import FailingWorkerNotice

PROTECTED_TASKS = "tests.stories.core.support.plans_samples:ProtectedTasksModule"


def plan_with_placed_tasks(played, *modules: str):
    return played(PlanTasksPlaced, *modules)










def test_a_failed_listener_receives_the_same_event_in_the_next_round(played, monkeypatch):
    story = plan_with_placed_tasks(played, "tests.stories.core.support.plans_samples:FailingNoticeModule")
    events = []

    def handle(listener, event, logged):
        events.append(logged.id)
        if len(events) == 1:
            raise ConnectionError("temporarily unavailable")

    monkeypatch.setattr(FailingWorkerNotice, "handle", handle)
    story.expect_success(lines.PLAN_CANCEL, "state: cancelled")
    story.run_listeners()
    story.run_listeners()
    story.expect_rows(len(events) >= 2, events[0] == events[1])
