from features.trigger import PERCENT, Trigger
from features.base import FeatureDetails, Line
from features.recital import BEHAVIOURS, LINES, WHISPER


class RulesDetails(FeatureDetails):
    name = "rules"
    when = "the user makes a ruling that binds every environment"

    title = "Rules"

    abstract = """
        The rules said again at every tenth of the context, and the injected ones kept in
        AGENTS.md and CLAUDE.md
    """

    help = """
        When the user makes a ruling that binds every environment, record it as a rule: journal rule create "<the ruling>"
        --brief "<the user's reason, and the message it came from>". Only the user strikes a rule. journal rule inject <n>
        keeps a rule in the managed block of both AGENTS.md and CLAUDE.md.

        Give it keywords with --set keywords="<word>,<word>": when one comes up as a whole word, the row is whispered to
        that session once, with its reasoning, and the call is never refused. --set keywords_in says where they match: text
        (what you write, in edits and in the chat), commands (shell commands), both (the default), or everything (any tool call,
        file paths, searches and URLs included).
    """

    runs_for_subagents = True

    trigger = Trigger(every=10, unit=PERCENT)

    lines = [
        *(line for line in LINES if line.name == WHISPER),
        Line(
            name="standing",
            title="{{count}} in force, read them",
            brief="{{rows}}",
            while_waiting=False,
        ),
    ]

    behaviours = BEHAVIOURS
