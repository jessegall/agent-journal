from core.modules.overview.support.overview_first import OverviewFirst


class StoryOverviewFirst(OverviewFirst):
    """A story that is not about the overview does not run it first."""

    is_required = False
