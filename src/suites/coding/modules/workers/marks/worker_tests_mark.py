from engine.chat.mark_declaration import MarkDeclaration
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.support.worker_marks import WORKERS_FAMILY


class WorkerTestsMark(MarkDeclaration):
    """The mark WorkerMarkType.TESTS."""

    type = WorkerMarkType.TESTS
    variants = WorkerMarkVariant
    family = WORKERS_FAMILY
    label = "Worker tests"
    mark_icon = "agent"
    process = True
