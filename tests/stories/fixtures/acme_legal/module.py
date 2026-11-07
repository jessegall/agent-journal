from core.base.model.added_state import AddedState
from core.base.model.move import Move
from core.base.model.state_addition import StateAddition
from core.base.module.module import Module
from core.base.viewer.button_declaration import ButtonCondition, ButtonDeclaration
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task

ADDED_STATE = AddedState("legal-hold")


class AcmeLegalModule(Module):
    """Holds a task for legal review."""

    name = "acme.legal"
    requires_core = ">=5,<6"
    parent_suite = "coding"
    dependencies = ["journal.core.tasks", "journal.suites.coding"]
    added_states = tuple([StateAddition(Task, ADDED_STATE, "Legal hold", TaskState.BLOCKED, TaskState.OPEN,
                                        (Move("hold", [TaskState.OPEN], ADDED_STATE), Move("release-hold", [ADDED_STATE], TaskState.OPEN)))])
    buttons = [ButtonDeclaration("legal.hold", tuple(["row.task"]), "Hold for legal", "task hold {row_id}", condition=ButtonCondition("state", tuple(["open"]))),
               ButtonDeclaration("legal.release", tuple(["row.task"]), "Release the hold", "task release-hold {row_id}", condition=ButtonCondition("state", tuple(["legal-hold"])))]
