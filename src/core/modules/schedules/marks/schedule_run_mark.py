from engine.chat.mark_declaration import MarkDeclaration
from core.modules.schedules.models.enums.schedule_mark_type import ScheduleMarkType
from core.modules.schedules.models.enums.schedule_mark_variant import ScheduleMarkVariant
from core.modules.schedules.support.schedule_marks import JOBS_FAMILY


class ScheduleRunMark(MarkDeclaration):
    """The mark ScheduleMarkType.RUN."""

    type = ScheduleMarkType.RUN
    variants = ScheduleMarkVariant
    family = JOBS_FAMILY
    label = "A scheduled job ran"
    mark_icon = "update"
    group_label = "{count} scheduled job runs"
