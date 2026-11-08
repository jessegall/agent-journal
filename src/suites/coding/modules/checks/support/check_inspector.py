from core.base.viewer.button_condition import ButtonCondition
from core.base.viewer.button_declaration import ButtonDeclaration
from core.base.viewer.inspector_declaration import InspectorDeclaration
from suites.coding.modules.checks.models.check import Check

CHECK_INSPECTOR = InspectorDeclaration(
    Check,
    reads="check show {row_id}",
    label="Check {id} · {state}",
    title="{title}",
    events=tuple(["check.*"]),
    actions=(
        ButtonDeclaration("checks.run", (), "Run the check now", "check run {row_id}", icon="start", primary=True, condition=ButtonCondition("state", tuple(["running"]))),
        ButtonDeclaration("checks.start", (), "Start the check again", "check start {row_id}", icon="resume", primary=True, condition=ButtonCondition("state", tuple(["stopped"]))),
        ButtonDeclaration("checks.stop", (), "Stop the check", "check stop {row_id}", icon="stop", condition=ButtonCondition("state", tuple(["running"]))),
    ),
    lists_fields=True,
)
