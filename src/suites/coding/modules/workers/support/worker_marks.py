from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_colouring import MarkColouring
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant

WORKERS_FAMILY = MarkFamily("workers.workers", "Workers", "worker", MarkGroup.AGENT, MarkColouring.OUTCOME)

WORKER_MARKS = [MarkDeclaration(WorkerMarkType.TESTS, WorkerMarkVariant, WORKERS_FAMILY, "Worker tests", "worker", process=True),
                MarkDeclaration(WorkerMarkType.WORKER, WorkerMarkVariant, WORKERS_FAMILY, "Workers", "worker", click=MarkClick.OPEN_ROW, group_label="Workers: {count} updates")]
