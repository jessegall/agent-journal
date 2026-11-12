class CommandCategory:
    is_watched: bool


class ProcessPart:
    category: CommandCategory
    is_visible: bool


class ReaderDemands:
    def needs_reader(self, part: ProcessPart) -> bool:
        # @righteous architecture_processes_run_shown_by_category_outside_run_visibility
        return part.category.is_watched
