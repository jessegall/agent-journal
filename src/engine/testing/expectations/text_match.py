def holds_text(whole: str, part: str) -> bool:
    """Whether a story's expected text appears in what the journal printed, in any case: a line's capitals are wording, not behaviour."""
    return part.casefold() in whole.casefold()


def holds_line(lines, part: str) -> bool:
    """Whether any of the lines holds the expected text, in any case."""
    return any(holds_text(line, part) for line in lines)
