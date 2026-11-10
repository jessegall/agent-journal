from core.modules.plans.support.unblockers.wait_graph import WaitGraph


def focus_of(agent):
    # @sin architecture_plans_focus_kept_outside_plan_focus
    return agent.metadata.module_part("journal.core.plans").get("focus_plan")


def explicit_focus(focus, agent):
    # @righteous architecture_plans_focus_kept_outside_plan_focus
    return focus.explicit_plan_id(agent)


def waits_by_hand(waits):
    # @sin architecture_plans_wait_graph_built_outside_plan_unblockers
    return WaitGraph(waits)


def waits_of_a_plan(unblockers, plan_id, agent):
    # @righteous architecture_plans_wait_graph_built_outside_plan_unblockers
    return unblockers.unblockers(plan_id, agent)


def ranked_by_hand(work):
    # @sin architecture_plans_focus_task_ranked_outside_the_picker
    return work.first_task_id()


def next_focus_task(picker, agent):
    # @righteous architecture_plans_focus_task_ranked_outside_the_picker
    return picker.first(agent)
