from core.modules.overview.support.overview_section import SECTION_LINES, OverviewSection


def test_a_short_section_is_shown_whole():
    assert OverviewSection("question list", "question:1 Which database?").lines() == "## question list\nquestion:1 Which database?"


def test_a_long_section_shows_its_first_lines_and_how_to_read_the_rest():
    text = "\n".join(f"message:{number}" for number in range(SECTION_LINES + 40))
    lines = OverviewSection("message reports", text).lines().splitlines()
    assert len(lines) == SECTION_LINES + 2
    assert lines[-1] == "40 more lines: journal message reports"
