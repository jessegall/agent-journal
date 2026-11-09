import math
from collections import Counter, defaultdict
from collections.abc import Sequence
from itertools import combinations, groupby, pairwise

OVERLAP_LIMIT_STEPS = 2
OVERLAP_LIMIT_SHARE = 0.6

LISTENER_STEP = "listeners"


class StoryOverlap:
    """Lays the paths of a run's stories over each other, a path being what a story did and what came of
    it, and fails stories of one file that begin with the same steps, two stories that share more than 60%
    of their path, and a story that reaches nothing the others do not. A story's cases count as one story,
    and the same steps from another start are other steps."""

    def __init__(self) -> None:
        self.stories: dict[str, list[str]] = {}
        self.story_paths: dict[str, list[str]] = {}

    def add(self, test_id: str, start: str, lines: Sequence[str], path: Sequence[str]) -> None:
        self.stories[test_id] = [start, *(line for line in lines if not line.startswith(LISTENER_STEP))]
        self.story_paths[test_id] = [start, *path]

    def report_lines(self) -> list[str]:
        paths = self.paths()
        return [*self.shared_openings(), *self.overlapping_pairs(paths), *self.redundant_stories(paths)]

    def shared_openings(self) -> list[str]:
        lines: list[str] = []
        for _, names in groupby(sorted(self.stories), key=lambda name: name.partition("::")[0]):
            for first, second in combinations(names, 2):
                shared = self.shared_steps(first, second)
                if first.partition("[")[0] != second.partition("[")[0] and len(shared) >= OVERLAP_LIMIT_STEPS:
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
        return self.stories[test_id][1:]

    def paths(self) -> dict[str, set[str]]:
        paths: dict[str, set[str]] = defaultdict(set)
        for test_id, (start, *steps) in self.story_paths.items():
            if steps:
                paths[test_id.partition("[")[0]] |= self.step_keys(start, steps)
        return dict(paths)

    def overlapping_pairs(self, paths: dict[str, set[str]]) -> list[str]:
        lines: list[str] = []
        for first, second in sorted(self.candidate_pairs(paths)):
            share = len(paths[first] & paths[second]) / len(paths[first] | paths[second])
            if share > OVERLAP_LIMIT_SHARE:
                lines.append(f"stories share {round(share * 100)}% of their steps, delete one or make them differ: {first} and {second}")
        return lines

    @staticmethod
    def redundant_stories(paths: dict[str, set[str]]) -> list[str]:
        counts = Counter(step_key for step_keys in paths.values() for step_key in step_keys)
        lines: list[str] = []
        for name, step_keys in sorted(paths.items(), key=lambda story: (len(story[1]), story[0])):
            if any(counts[step_key] == 1 for step_key in step_keys):
                continue
            counts.subtract(step_keys)
            lines.append(f"story reaches nothing the other stories do not: {name}")
        return lines

    @staticmethod
    def candidate_pairs(paths: dict[str, set[str]]) -> set[tuple[str, str]]:
        counts = Counter(step_key for step_keys in paths.values() for step_key in step_keys)
        step_stories: dict[str, list[str]] = defaultdict(list)
        pairs: set[tuple[str, str]] = set()
        for story_id, step_keys in paths.items():
            rarest_first = sorted(step_keys, key=lambda step_key: (counts[step_key], step_key))
            for step_key in rarest_first[:len(step_keys) - math.ceil(OVERLAP_LIMIT_SHARE * len(step_keys)) + 1]:
                pairs.update((min(story_id, previous_id), max(story_id, previous_id)) for previous_id in step_stories[step_key])
                step_stories[step_key].append(story_id)
        return pairs

    @staticmethod
    def step_keys(start: str, steps: Sequence[str]) -> set[str]:
        path = [start, *steps]
        return {f"{start}: {step}" for step in path} | {f"{start}: {step} then {following}" for step, following in pairwise(path)}
