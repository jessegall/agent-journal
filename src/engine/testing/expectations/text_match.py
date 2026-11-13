from engine.testing.expectations.expected_nudge import ExpectedNudge

ExpectedText = str | ExpectedNudge


# Whether a story's expected text appears in what the journal printed, in any case: a line's capitals are wording, not
# behaviour. A nudge a story names by its declaration matches the declaration's own template.
def contains_text(full: str, part: ExpectedText) -> bool:
    if isinstance(part, ExpectedNudge):
        return part.is_in(full)
    return part.casefold() in full.casefold()


# Whether any of the lines holds the expected text, in any case.
def contains_line(lines, part: ExpectedText) -> bool:
    return any(contains_text(line, part) for line in lines)
