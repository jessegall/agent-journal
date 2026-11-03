import shlex
from dataclasses import dataclass

COMMAND = ("journal", "search", "find")
MODEL_FLAG = "--model"
SHELL_OPERATORS = ("|", "||", "&&", ";", ">", ">>", "<")


@dataclass(frozen=True)
class SearchLine:
    """The terms and the model names of a `journal search find` line an agent ran, read from the line itself."""

    terms: tuple[str, ...]
    models: tuple[str, ...]

    @classmethod
    def parsed(cls, line: str) -> "SearchLine | None":
        try:
            tokens = shlex.split(line)
        except ValueError:
            return None
        if tuple(tokens[: len(COMMAND)]) != COMMAND:
            return None
        terms: list[str] = []
        models: list[str] = []
        arguments = iter(tokens[len(COMMAND):])
        for word in arguments:
            if word in SHELL_OPERATORS:
                break
            if word == MODEL_FLAG:
                models.extend(name for name in next(arguments, "").split(",") if name)
            elif word.startswith(f"{MODEL_FLAG}="):
                models.extend(name for name in word.removeprefix(f"{MODEL_FLAG}=").split(",") if name)
            else:
                terms.append(word)
        return cls(tuple(terms), tuple(models)) if terms else None
