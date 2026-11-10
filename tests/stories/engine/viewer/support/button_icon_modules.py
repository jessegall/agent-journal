from engine.module.module import Module
from engine.viewer.button_declaration import ButtonDeclaration
from engine.enums.window_icon import WindowIcon

PATH = "tests.stories.engine.viewer.support.button_icon_modules"
DEPENDENCIES = ["journal.core.tasks", "journal.core.plans", "journal.core.viewer"]


def button(icon: str, **fields: object) -> ButtonDeclaration:
    return ButtonDeclaration(f"iconic.{icon}", tuple(["row.task"]), "Start the task", "task start {row_id}", icon=icon, **fields)


class NewIconModule(Module):
    name = "iconic"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    buttons = [button(icon) for icon in (WindowIcon.PAUSE, WindowIcon.RESUME, WindowIcon.START, WindowIcon.RESTORE, WindowIcon.LOCK)]


class ConfirmingModule(NewIconModule):
    buttons = [button("lock", confirm="Lock this task?", danger=True)]
