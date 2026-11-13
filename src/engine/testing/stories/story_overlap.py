import math
from collections import Counter, defaultdict
from collections.abc import Sequence
from itertools import combinations, groupby, pairwise
from pathlib import PurePosixPath

from engine.testing.stories.story_fixture import StoryFixture

OVERLAP_LIMIT_STEPS = 2
FILE_OPENING_STEPS = 3
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
        self.story_fixtures: dict[str, str] = {}
        self.story_checks: dict[str, set[str]] = defaultdict(set)

    def add(self, test_id: str, start: str, lines: Sequence[str], path: Sequence[str], fixture: str = "", checks: Sequence[str] = ()) -> None:
        self.stories[test_id] = [start, *(line for line in lines if not line.startswith(LISTENER_STEP))]
        self.story_fixtures[test_id] = fixture
        self.story_paths[test_id] = [start, *path]
        self.story_checks[test_id.partition("[")[0]] |= set(checks)

    def add_checks(self, checks: dict[str, list[str]]) -> None:
        for name, subjects in checks.items():
            self.story_checks[name] |= set(subjects)

    def report_lines(self) -> list[str]:
        paths = self.paths()
        reached = {name: step_keys | {f"checks {subject}" for subject in self.story_checks[name]} for name, step_keys in paths.items()}
        return [*self.shared_openings(), *self.overlapping_pairs(paths), *self.redundant_stories(reached)]

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
            if share > OVERLAP_LIMIT_SHARE and self.check_the_same_thing(first, second):
                lines.append(f"stories share {round(share * 100)}% of their steps and check the same thing, merge their checks into one story: {first} and {second}")
        return lines

    def check_the_same_thing(self, first: str, second: str) -> bool:
        """Two stories check the same thing unless each records what it checks and nothing of the one is in
        the other: stories that check wholly different things are different tests."""
        first_checks, second_checks = self.story_checks[first], self.story_checks[second]
        return not first_checks or not second_checks or bool(first_checks & second_checks)

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

    def no_fixture_lines(self) -> list[str]:
        fixtures = {test_id.partition("[")[0]: fixture for test_id, fixture in self.story_fixtures.items()}
        used: dict[str, Counter[str]] = defaultdict(Counter)
        for test_id, fixture in fixtures.items():
            if fixture:
                used[self.folder(test_id)][fixture] += 1
        return [self.no_fixture_line(test_id, used[self.folder(test_id)]) for test_id, fixture in sorted(fixtures.items()) if not fixture]

    @staticmethod
    def no_fixture_line(test_id: str, folder_fixtures: Counter[str]) -> str:
        if folder_fixtures:
            return f"story starts from no fixture, start it from {folder_fixtures.most_common(1)[0][0]} or a fixture built on it: {test_id}"
        return f"story starts from no fixture, write a StoryFixture for its start and use it: {test_id}"

    @staticmethod
    def folder(test_id: str) -> str:
        return str(PurePosixPath(test_id.partition("::")[0]).parent)

    def file_opening_lines(self) -> list[str]:
        openings: dict[tuple[str, ...], set[str]] = defaultdict(set)
        for test_id, (start, *steps) in self.stories.items():
            if len(steps) >= FILE_OPENING_STEPS:
                openings[(start, *steps[:FILE_OPENING_STEPS])].add(test_id.partition("[")[0])
        return [f"stories of {len({name.partition('::')[0] for name in names})} files share their first {FILE_OPENING_STEPS} steps, move them into a fixture: {', '.join(sorted(names))}"
                for names in openings.values() if len({name.partition("::")[0] for name in names}) > 1]

    @staticmethod
    def empty_fixture_lines(fixtures: Sequence[type[StoryFixture]]) -> list[str]:
        return [f"fixture adds no step to {fixture.parent.__name__} that it builds on, remove it or give it a step: {fixture.__module__}.{fixture.__name__}"
                for fixture in fixtures if fixture.parent is not None and not fixture.has_steps()]
