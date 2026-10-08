import re
from dataclasses import dataclass

from engine.journal_calls import pieces
from engine.shell import without_scripts

WHOLE_SUITE = "The whole suite"
MANY = 3
RUNNER = re.compile(r"(?:^|/)(?:[Pp]ython[\d.]*|pytest|py\.test|vitest|jest|phpunit|rspec|node|npx|npm|yarn|pnpm|go|cargo|dotnet|mvn|gradlew?|mix|php|bundle|perl)$")
TESTING = re.compile(r"pytest|vitest|jest|phpunit|rspec|\btests?\b|test_|artisan test|go test|cargo test|dotnet test|mvn|gradle|mix test")
FEATURE_TEST = re.compile(r"(?:^|/)features/([^/]+)/test\.py$")
FILTERS = ("-k", "--filter", "--testNamePattern", "-t")
TAKING_A_VALUE = frozenset({"-m", "-n", "-p", "-c", "-o", "--timeout", "--dist", "--maxfail", "--tb", "--rootdir", "--reporter", "--project", "--config",
                            "--testPathPattern", "--logger"})


@dataclass(frozen=True)
class Tested:
    name: str
    command: str


def testing_piece(command: str) -> tuple[str, ...]:
    return next((piece for piece in pieces(without_scripts(command)) if RUNNER.search(piece[0] if piece else "") and TESTING.search(" ".join(piece))), ())


def targets(words: tuple[str, ...]) -> list[str]:
    found, skip = [], False
    for index, word in enumerate(words[1:], 1):
        if skip:
            skip = False
        elif word in FILTERS and index + 1 < len(words):
            found.append(words[index + 1])
            skip = True
        elif word.split("=", 1)[0] in FILTERS:
            found.extend(word.split("=", 1)[1:])
        elif word in TAKING_A_VALUE:
            skip = True
        elif not word.startswith("-") and word not in (".", "./") and ("/" in word or "." in word or "::" in word):
            found.append(word.split("::", 1)[0])
    return found


def called(target: str) -> str:
    feature = FEATURE_TEST.search(target)
    return f"Tests of {feature.group(1).replace('_', ' ')}" if feature else target


def tested(command: str) -> Tested:
    piece = testing_piece(command)
    if not piece:
        return Tested("Tests", command)
    named = list(dict.fromkeys(called(target) for target in targets(piece)))
    shown = ", ".join(named[:MANY]) + (f" and {len(named) - MANY} more" if len(named) > MANY else "")
    return Tested(shown or WHOLE_SUITE, " ".join(piece))
