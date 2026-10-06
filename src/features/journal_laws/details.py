from features.base import Behaviour, FeatureDetails, Line
from features.recital import LINES, WHISPER, whispering
from features.settings import Setting
from features.trigger import MINUTES, Trigger
from features.groups import Group

LARGEST_RESULT = "largest result"
TOO_LONG = "too long"


class LawDetails(FeatureDetails):
    explains = 'The journal gives every agent the same built-in rules for reading and delegating work. You can read their wording in the project’s instruction files.'
    name = "journal_laws"
    group = Group.LAWS
    has_skill = False

    title = "Laws"

    aliases = ("law",)

    abstract = "Rules every agent follows: how it starts subagents, and how much it reads at once."

    help = """
        Always on. The laws are handed to every session, kept in AGENTS.md and CLAUDE.md, and
        enforced before a subagent dispatch.

        Each law carries plain keywords and where they match, declared beside it. When one of them appears as a
        whole word, you are shown the law once, with its reason.

        After a tool call whose result is larger than the floor and larger than any earlier one
        in the session, you are told its size and that the next read can be narrower. It
        is said only on a new largest result, so a session hears it once or twice.

        A shell command whose output runs past twice output_lines is shown by its two ends, and
        the whole output is kept as an output row with its file, named in the cut line, to grep
        or read by range; the last 50 are kept. This needs a provider that runs its commands
        through a shell prefix, as Claude does.
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
        Line(
            name=TOO_LONG,
            title="{{file}} is {{size}} bytes and {{provider}} reads only its first {{limit}}",
            brief="""
                The journal's block leads the file, so the laws and rules are read; the project's own
                text past that point is not. Tell the user, who can shorten the file or raise the limit.
            """,
        ),
    ]

    behaviours = [
        *whispering("law"),
        Behaviour(
            name=LARGEST_RESULT,
            title="Tell the agent about the largest tool result so far",
        ),
        Behaviour(
            name=TOO_LONG,
            title="Warn when CLAUDE.md or AGENTS.md is longer than the provider reads",
            trigger=Trigger(every=1440, unit=MINUTES),
        ),
    ]

    settings = [
        Setting(
            name="cartoon_names",
            default=False,
            title="Name subagents after cartoon characters",
        ),
        Setting(
            name="whole_read_lines",
            default=600,
            title="Block reading a whole file longer than",
            unit="lines",
        ),
        Setting(
            name="output_lines",
            default=200,
            title="Lines kept from each end of long output",
            abstract="0 keeps every line",
            unit="lines",
        ),
        Setting(
            name="result_floor",
            default=20_000,
            title="Ignore results smaller than",
            under="largest result",
            unit="characters",
        ),
    ]
