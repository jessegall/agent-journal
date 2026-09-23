from features.base import Behaviour, FeatureDetails, Line
from features.journal_laws.handlers import LARGEST_RESULT
from features.recital import BEHAVIOURS, LINES, WHISPER
from features.settings import Setting


class LawDetails(FeatureDetails):
    name = "journal_laws"

    title = "Journal laws"

    aliases = ("law",)

    abstract = "The laws the journal ships to every agent and project: how to dispatch, and how to read"

    help = """
        Always on. The laws are handed to every session, kept in AGENTS.md and CLAUDE.md, and
        enforced before a subagent dispatch.

        Each law carries plain keywords and where they match, declared beside it. When one of
        them comes up as a whole word, the law is whispered with its reason.

        After a tool call whose result is larger than the floor and larger than any earlier one
        in the session, you are told its size and that the next read can be narrower. It
        is said only on a new largest result, so a session hears it once or twice.
    """

    fixed = True

    lines = [
        *(line for line in LINES if line.name == WHISPER),
        Line(
            name=LARGEST_RESULT,
            title="that {{tool}} call returned {{size}} characters, the largest this session",
            brief="""
                It stays in the context for good. If you were looking for one thing in it, the
                next read can be narrower: grep for the line, sed a range, head the file.
            """,
        ),
    ]

    behaviours = [
        *BEHAVIOURS,
        Behaviour(
            name=LARGEST_RESULT,
            title="Tell the agent when a tool result is the largest this session",
            abstract="Only above the floor, and only when it is larger than every earlier result",
        ),
    ]

    settings = [
        Setting(
            name="whole_read_lines",
            default=300,
            title="Refuse reading a whole file longer than",
            abstract="A file this long is read by range or searched, not read whole",
            unit="lines",
        ),
        Setting(
            name="output_lines",
            default=200,
            title="Keep this many lines at each end of a long command's output",
            abstract="The lines between are cut, with a note on how to see them; 0 keeps every line",
            unit="lines",
        ),
        Setting(
            name="result_floor",
            default=20_000,
            title="Tell the agent about a tool result from",
            abstract="A result smaller than this is never mentioned",
            unit="characters",
        ),
    ]
