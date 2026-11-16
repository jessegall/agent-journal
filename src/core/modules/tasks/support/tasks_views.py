from core.modules.tasks.models.environment_card import EnvironmentCard
from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.models.task_block_review import TaskBlockReview
from core.modules.tasks.models.task_card import TaskCard
from core.modules.tasks.models.task_edge import TaskEdge
from core.modules.tasks.models.task_inspection_row import TaskInspectionRow
from core.modules.tasks.models.task_tag_word import TaskTagWord

TASKS_VIEWS = [TaskTagWord, OpenDependency, TaskCard, TaskEdge, EnvironmentCard, TaskInspectionRow, TaskBlockReview]
