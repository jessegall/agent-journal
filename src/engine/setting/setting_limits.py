from collections.abc import Iterator

TITLE_LIMIT_CHARACTERS = 40
DESCRIPTION_LIMIT_CHARACTERS = 120


def length_problems(title: str, description: str, key: str) -> Iterator[str]:
    if len(title) > TITLE_LIMIT_CHARACTERS:
        yield f"the title of {key} is {len(title)} characters; a title is at most {TITLE_LIMIT_CHARACTERS}"
    if len(description) > DESCRIPTION_LIMIT_CHARACTERS:
        yield f"the description of {key} is {len(description)} characters; a description is at most {DESCRIPTION_LIMIT_CHARACTERS}"
