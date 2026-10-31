POINT_PREFIX = "- "


def brief_point_count(brief: str) -> int:
    return max(1, sum(1 for line in brief.splitlines() if line.startswith(POINT_PREFIX)))
