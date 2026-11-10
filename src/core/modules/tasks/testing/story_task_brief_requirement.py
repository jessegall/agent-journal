from core.modules.tasks.support.task_brief_requirement import TaskBriefRequirement


class StoryTaskBriefRequirement(TaskBriefRequirement):
    """A story that is not about the task brief does not read it first."""

    is_required = False
