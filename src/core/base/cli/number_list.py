from argparse import ArgumentTypeError


def number_list(text: str) -> tuple[int, ...]:
    parts = text.split(",")
    if not all(part.strip().isdigit() for part in parts):
        raise ArgumentTypeError(f"{text} is no list of whole numbers, such as 3,7,9")
    return tuple(int(part) for part in parts)
