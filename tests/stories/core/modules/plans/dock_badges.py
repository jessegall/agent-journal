from core.modules.plans.support.plan_marks import PLAN_DOCKS


def test_a_docked_plan_says_where_it_stands_on_a_badge_after_its_title():
    expect_type_dock_plan(PLAN_DOCKS, {'plans.draft': 'Planned', 'plans.waiting': '', 'plans.started': 'Started', 'plans.paused': 'Paused', 'plans.completed': 'Done', 'plans.cancelled': 'Cancelled'})


def test_a_plan_waiting_for_approval_has_an_approve_button_in_its_dock_card():
    buttons = {str(dock.type): [button.runs for button in dock.buttons] for dock in PLAN_DOCKS}
    expect_plans_waiting_buttons(buttons, ["plan approve {row_id}"])
    expect_primary_button_plan(PLAN_DOCKS, "plans.waiting", [True])
    expect_plans_started_buttons(buttons, [])


def expect_plans_started_buttons(buttons, expected) -> None:
    actual = buttons['plans.started']
    assert actual == expected, actual


def expect_primary_button_plan(item, text, expected) -> None:
    actual = [button.primary for dock in item if str(dock.type) == text for button in dock.buttons]
    assert actual == expected, actual


def expect_plans_waiting_buttons(buttons, expected) -> None:
    actual = buttons['plans.waiting']
    assert actual == expected, actual


def expect_type_dock_plan(item, expected) -> None:
    actual = {str(dock.type): dock.badge for dock in item}
    assert actual == expected, actual
