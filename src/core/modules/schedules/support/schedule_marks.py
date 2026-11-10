from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup
from core.modules.schedules.models.enums.schedule_mark_type import ScheduleMarkType
from core.modules.schedules.models.enums.schedule_mark_variant import ScheduleMarkVariant

JOBS_FAMILY = MarkFamily("schedules.jobs", "Scheduled jobs", "update", MarkGroup.AGENT)

SCHEDULE_MARKS = [MarkDeclaration(ScheduleMarkType.RUN, ScheduleMarkVariant, JOBS_FAMILY, "A scheduled job ran", "update", group_label="{count} scheduled job runs")]
