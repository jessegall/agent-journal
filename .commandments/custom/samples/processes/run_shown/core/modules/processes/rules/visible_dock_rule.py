class CommandCategory:
    is_watched: bool


class ProcessPart:
    category: CommandCategory
    is_visible: bool


class VisibleDockRule:
    name = "samples.visible-dock"

    def answer(self, parts: list[ProcessPart]) -> list[ProcessPart]:
        # @sin architecture_processes_run_shown_by_category_outside_run_visibility
        return [part for part in parts if part.is_visible]
