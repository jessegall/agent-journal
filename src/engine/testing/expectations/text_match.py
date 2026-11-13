from engine.testing.expectations.expect_nudge import SaidNudge

ExpectedText = str | SaidNudge


def holds_text(whole: str, part: ExpectedText) -> bool:
    """Whether a story's expected text appears in what the journal printed, in any case: a line's capitals are wording,
    not behaviour. A nudge a story names by its declaration matches the declaration's own template."""
    if isinstance(part, SaidNudge):
        return part.is_in(whole)
    return part.casefold() in whole.casefold()


def holds_line(lines, part: ExpectedText) -> bool:
    """Whether any of the lines holds the expected text, in any case."""
    return any(holds_text(line, part) for line in lines)
