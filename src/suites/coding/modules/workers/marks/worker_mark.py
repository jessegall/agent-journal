from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.support.worker_marks import WORKERS_FAMILY


class WorkerMark(MarkDeclaration):
    """The mark WorkerMarkType.WORKER."""

    type = WorkerMarkType.WORKER
    variants = WorkerMarkVariant
    family = WORKERS_FAMILY
    label = "Workers"
    mark_icon = "agent"
    click = MarkClick.OPEN_ROW
    group_label = "Workers: {count} updates"
