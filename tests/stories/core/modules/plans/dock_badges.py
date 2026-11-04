from core.modules.plans.support.plan_marks import PLAN_DOCKS


def test_a_docked_plan_says_where_it_stands_on_a_badge_after_its_title():
    expect_type_dock_plan(PLAN_DOCKS, {'plans.draft': 'Planned', 'plans.waiting': '', 'plans.started': 'Started', 'plans.paused': 'Paused', 'plans.completed': 'Done', 'plans.cancelled': 'Cancelled'})


def expect_type_dock_plan(item, expected) -> None:
    actual = {str(dock.type): dock.badge for dock in item}
    assert actual == expected, actual
