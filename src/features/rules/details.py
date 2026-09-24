from features.trigger import PERCENT, Trigger
from features.base import FeatureDetails, Line
from features.recital import BEHAVIOURS, LINES, WHISPER


class RulesDetails(FeatureDetails):
    name = "rules"
    when = "the user makes a ruling that binds every environment"

    title = "Rules"

    abstract = """
        The rules said again at every quarter of the context, and the injected ones kept in
        AGENTS.md and CLAUDE.md
    """

    help = """
        A rule belongs to the whole project: every environment and every agent in it is bound by it. When the user makes a
        ruling of that kind, record it as a rule, worded as the ruling itself ("Always ...", "Never ..."): journal rule create
        "<the ruling>" --brief "<the user's reason, and the message it came from>". What is true of this environment is a
        fact, and what to keep doing here is a reminder; both stay in this environment. Right after you make a rule you are
        asked to read it again as one. Only the user strikes a rule, except one you just made that turns out to belong to one
        environment. journal rule inject <n> keeps a rule in the managed block of both AGENTS.md and CLAUDE.md.

        Give it keywords with --set keywords="<word>,<word>": when one appears as a whole word, you are shown the
        row once, with its reasoning, and the tool call still goes through. --set keywords_in says where they match: text
        (what you write, in edits and in the chat), commands (shell commands), both (the default), or everything (any tool call,
        file paths, searches and URLs included).
    """

    runs_for_subagents = True

    trigger = Trigger(every=25, unit=PERCENT)

    lines = [
        *(line for line in LINES if line.name == WHISPER),
        Line(
            name="review",
            title="Is rule {{n}} a ruling for the whole project?",
            brief='rule {{n}}, "{{title}}", binds every environment of the project. Keep it only if it is a ruling for all of them, '
                  'worded as one ("Always ...", "Never ..."). If it is about this environment or its current work, strike it with '
                  'journal rule strike {{n}} --how "<why>" and file it here as a fact or a reminder instead.',
        ),
        Line(
            name="standing",
            title="{{count}} in force, read them",
            brief="{{rows}}",
            while_waiting=False,
        ),
    ]

    behaviours = BEHAVIOURS
