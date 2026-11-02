from core.modules.plans.support.plan_marks import PLAN_DOCKS


def test_a_docked_plan_says_where_it_stands_on_a_badge_after_its_title():
    assert {str(dock.type): dock.badge for dock in PLAN_DOCKS} == {"plans.draft": "Draft", "plans.waiting": "", "plans.started": "Started", "plans.paused": "Paused",
                                                                    "plans.completed": "Done", "plans.cancelled": "Cancelled"}


def test_a_plan_waiting_for_approval_has_an_approve_button_in_its_dock_card():
    buttons = {str(dock.type): [button.runs for button in dock.buttons] for dock in PLAN_DOCKS}
    assert buttons["plans.waiting"] == ["plan approve {row_id}"]
    assert buttons["plans.started"] == []
