class CommandCategory:
    is_watched: bool


class ProcessPart:
    category: CommandCategory
    is_visible: bool


class WatchedMarkListener:
    def handle(self, part: ProcessPart) -> bool:
        # @sin architecture_processes_run_shown_by_category_outside_run_visibility
        return part.category.is_watched
