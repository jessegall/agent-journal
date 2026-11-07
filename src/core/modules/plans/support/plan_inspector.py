from core.base.viewer.button_condition import ButtonCondition
from core.base.viewer.button_declaration import ButtonDeclaration
from core.base.viewer.inspector_component import InspectorComponent
from core.base.viewer.inspector_declaration import InspectorDeclaration
from core.base.viewer.inspector_links import InspectorLinks
from core.base.viewer.inspector_width import InspectorWidth
from core.base.viewer.text_field import TextField
from core.modules.plans.models.plan import Plan

ASSIGNABLE = ("draft", "ready", "approved", "started", "blocked")
CANCELLABLE = ("draft", "ready", "approved", "started", "blocked")

PLAN_INSPECTOR = InspectorDeclaration(
    Plan,
    reads="plan inspect {row_id}",
    label="Plan {id} · {state}",
    title="{title}",
    width=InspectorWidth.MEDIUM,
    comments=True,
    events=("plan.*",),
    actions=(
        ButtonDeclaration("plans.mark-ready", (), "Mark the plan ready", "plan ready {row_id}", icon="plan", condition=ButtonCondition("state", ("draft",))),
        ButtonDeclaration("plans.assign-worker", (), "Assign to worker", "plan assign {row_id} --worker={worker}", icon="plan", condition=ButtonCondition("state", ASSIGNABLE),
                          fields=(TextField("worker", "Worker number"),)),
        ButtonDeclaration("plans.assign-main", (), "Let the agent pick", "plan assign {row_id}", icon="plan", condition=ButtonCondition("state", ASSIGNABLE)),
        ButtonDeclaration("plans.start", (), "Start the plan", "plan start {row_id}", icon="start", primary=True, condition=ButtonCondition("state", ("approved",))),
        ButtonDeclaration("plans.pause", (), "Pause the plan", "plan block {row_id} --reason={reason}", icon="pause", condition=ButtonCondition("state", ("started",)),
                          fields=(TextField("reason", "Why does it wait?"),)),
        ButtonDeclaration("plans.resume", (), "Resume the plan", "plan unblock {row_id}", icon="resume", primary=True, condition=ButtonCondition("state", ("blocked",))),
        ButtonDeclaration("plans.complete", (), "Complete the plan", "plan close {row_id}", icon="tick", condition=ButtonCondition("state", ("started",))),
        ButtonDeclaration("plans.cancel", (), "Cancel the plan", "plan cancel {row_id} --reason={reason}", icon="stop", danger=True, condition=ButtonCondition("state", CANCELLABLE),
                          fields=(TextField("reason", "Why is it cancelled?"),)),
    ),
    components=(InspectorComponent("plans.plan-details"), InspectorComponent("plans.plan-phases"), InspectorComponent("plans.plan-timeline", tab="Timeline")),
    links=InspectorLinks(outside_plan=True),
)
