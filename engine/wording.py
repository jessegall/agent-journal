def noun(n: int, word: str) -> str:
    return f"{word}{'s' if n != 1 else ''}"


def plural(n: int, word: str) -> str:
    return f"{n} {noun(n, word)}"


def counted(groups: dict[tuple, dict]) -> list[str]:
    return [f"{plural(len(ns), f'new {type_}')} {', '.join(map(str, ns))}" if action == "created"
            else f"{noun(len(ns), type_)} {', '.join(map(str, ns))} {action}"
            for (type_, action), ns in groups.items()]
