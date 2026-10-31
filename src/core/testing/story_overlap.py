from core.testing.story import Story

OVERLAP_LIMIT_STEPS = 2


class StoryOverlap:
    """Remembers the command lines each story ran, and names the stories of one file that begin with the same
    steps, so those steps move into a fixture both start from."""

    def __init__(self) -> None:
        self.stories: dict[str, Story] = {}

    def add(self, test_id: str, story: Story) -> None:
        self.stories[test_id] = story

    def report_lines(self) -> list[str]:
        lines: list[str] = []
        names = sorted(self.stories)
        for position, first in enumerate(names):
            for second in names[position + 1:]:
                shared = self.shared_steps(first, second)
                if first.split("::")[0] == second.split("::")[0] and len(shared) >= OVERLAP_LIMIT_STEPS:
                    lines.append(f"stories share their first {len(shared)} steps, move them into a fixture: {first} and {second.split('::')[-1]}")
        return lines

    def shared_steps(self, first: str, second: str) -> list[str]:
        shared: list[str] = []
        for first_line, second_line in zip(self.lines(first), self.lines(second)):
            if first_line != second_line:
                break
            shared.append(first_line)
        return shared

    def lines(self, test_id: str) -> list[str]:
        return [outcome.line for outcome in self.stories[test_id].results]
