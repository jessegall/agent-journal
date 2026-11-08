from core.base.module.module import Module
from core.base.viewer.button_declaration import ButtonDeclaration

PATH = "tests.stories.core.base.viewer.support.button_style_modules"
DEPENDENCIES = ["journal.core.tasks", "journal.core.plans", "journal.core.viewer"]


class PlainCardButtonModule(Module):
    name = "styled"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    buttons = [ButtonDeclaration("styled.start", ("dock.plans.waiting", "row.plan"), "Start the task", "task start {row_id}", icon="start")]


class BareCardButtonModule(PlainCardButtonModule):
    buttons = [ButtonDeclaration("styled.start", ("dock.plans.waiting", "row.plan"), "Start the task", "task start {row_id}")]


class PanelWordButtonModule(PlainCardButtonModule):
    buttons = [ButtonDeclaration("styled.start", tuple(["row.plan"]), "Close the plan", "task start {row_id}")]
