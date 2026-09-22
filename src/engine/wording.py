def noun(n: int, word: str) -> str:
    return f"{word}{'s' if n != 1 else ''}"


def plural(n: int, word: str) -> str:
    return f"{n} {noun(n, word)}"


APPENDS: dict[str, list] = {}


def appended(on: str, values: dict, line: str) -> str:
    return " - ".join([line, *(append(values) for append in APPENDS.get(on, []))])


def counted(groups: dict[tuple, dict]) -> list[str]:
    return [appended(f"{type_}.{action}", {"numbers": list(ns)}, f"{plural(len(ns), f'new {type_}')} {', '.join(map(str, ns))}" if action == "created"
                    else f"{noun(len(ns), type_)} {', '.join(map(str, ns))} {action}")
            for (type_, action), ns in groups.items()]
