from features.base import FeatureDetails, Line
from features.command_tags.reading import RUNS
from features.settings import Setting


class TagsDetails(FeatureDetails):
    name = "command_tags"
    when = "you open a turn with a tag such as [!reply:N], or a tag you wrote was refused"

    title = "Command tags"

    aliases = ("tags",)

    speaks_while_waiting = True

    abstract = """
        Everything the agent writes reaches the chat, and a tag carrying a number or a name
        runs the command it stands for
    """

    help = """
        A message without a tag is a plain message in the chat.

        [!internal] at the start of a message keeps it out of the chat. Use it only for a
        message that narrates what you do next, like "Checking the build next";
        anything the user should read goes out without it.

        tags.runs maps a tag to the command it stands for, so [!reply:12] runs
        journal message reply 12 with the turn as its text ([!reply:12,13] answers both messages with one reply), and [!todo="the title"] files a
        to-do with that title and the turn as its brief. [!fact="the claim"] and [!rule="the ruling"]
        file a fact or a rule the same way.

        The first word names the target; named arguments follow it in any order, as in
        [!rule="the ruling", keywords=("git", "branch")], and reach the command as --set.

        A tag runs once, keyed to the turn it came from; two tags in one turn run in the order
        they appear; and a refusal comes back as a nudge on the next turn rather than at the
        moment of acting.
    """

    settings = [
        Setting(
            name="runs",
            default=dict(RUNS),
            title="What each tag runs",
            abstract="A tag's name and the journal command it runs; entries set here are laid over the shipped ones.",
        ),
    ]

    lines = [
        Line(
            name="refused",
            title="the {{tag}} tag on {{on}} did not run",
            brief="{{error}} - add what is missing to the tag itself",
        ),
    ]
