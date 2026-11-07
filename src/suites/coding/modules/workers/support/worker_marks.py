from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_colouring import MarkColouring
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant

WORKERS_FAMILY = MarkFamily("workers.workers", "Workers", "agent", MarkGroup.AGENT, MarkColouring.OUTCOME)

WORKER_MARKS = [MarkDeclaration(WorkerMarkType.SPLIT, WorkerMarkVariant, WORKERS_FAMILY, "Program split and routes", "agent", click=MarkClick.OPEN_ROW), MarkDeclaration(WorkerMarkType.TESTS, WorkerMarkVariant, WORKERS_FAMILY, "Worker tests", "agent", process=True),
                MarkDeclaration(WorkerMarkType.WORKER, WorkerMarkVariant, WORKERS_FAMILY, "Workers", "agent", click=MarkClick.OPEN_ROW, group_label="Workers: {count} updates")]
