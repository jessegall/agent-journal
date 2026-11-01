from core.modules.plans.support.plan_marks import PLAN_DOCKS


def test_a_docked_plan_says_where_it_stands_on_a_badge_after_its_title():
    assert {str(dock.type): dock.badge for dock in PLAN_DOCKS} == {"plans.draft": "Draft", "plans.waiting": "Waiting for you", "plans.started": "Started", "plans.paused": "Paused",
                                                                    "plans.completed": "Done", "plans.cancelled": "Cancelled"}
