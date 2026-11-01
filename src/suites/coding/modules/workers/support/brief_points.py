POINT_PREFIX = "- "


def brief_points(brief: str, title: str) -> tuple[str, ...]:
    """The lines of a brief that start with "- ", or the whole brief as one point when it has none, or the title when it has no brief."""
    lines = tuple(line[len(POINT_PREFIX):] for line in brief.splitlines() if line.startswith(POINT_PREFIX))
    return lines or tuple([brief or title])


def brief_point_count(brief: str) -> int:
    return len(brief_points(brief, ""))
