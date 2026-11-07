import shlex
from dataclasses import dataclass

COMMAND = ("journal", "search", "find")
MODEL_FLAG = "--model"


@dataclass(frozen=True)
class SearchLine:
    """The terms and the model names of a `journal search find` part of a line an agent ran."""

    terms: tuple[str, ...]
    models: tuple[str, ...]

    @classmethod
    def parsed(cls, part: str) -> "SearchLine | None":
        try:
            tokens = shlex.split(part)
        except ValueError:
            return None
        if tuple(tokens[: len(COMMAND)]) != COMMAND:
            return None
        terms: list[str] = []
        models: list[str] = []
        arguments = iter(tokens[len(COMMAND):])
        for word in arguments:
            if word == MODEL_FLAG:
                models.extend(name for name in next(arguments, "").split(",") if name)
            elif word.startswith(f"{MODEL_FLAG}="):
                models.extend(name for name in word.removeprefix(f"{MODEL_FLAG}=").split(",") if name)
            else:
                terms.append(word)
        return cls(tuple(terms), tuple(models)) if terms else None
