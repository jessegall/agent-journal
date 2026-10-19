from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.features.pins.commands.notice_command import NoticeCommand
from journal.features.pins.listeners.unpinned_link import UnpinnedLink
from journal.features.pins.listeners.unpinned_link_in_output import UnpinnedLinkInOutput
from journal.support.option import Option
from journal.support.skill import Skill


class Pins(Feature):
    name = "pins"
    title = "Pinned links"
    help = "A link the agent gives the user is pinned above the chat, so it is not lost as the chat scrolls; the user closes it when done."
    commands = (NoticeCommand,)
    SUGGEST_EVERY = Option("pins.suggest_every", "Suggest an unpinned link again after", "The agent's tool uses before a link it has not pinned is suggested again", 50, unit="tool uses")
    options = (SUGGEST_EVERY,)
    listeners = (UnpinnedLink, UnpinnedLinkInOutput)

    UNPINNED = Nudge(name, "unpinned", "{{url}} is not pinned; if the user will come back to it, pin it", "`journal notice create \"<what it is>\" --link \"{{url}}\" --label \"<Open ...>\"`", repeat_after=0)
    nudges = (UNPINNED,)

    skill = Skill("pinned-links", "Load it when you point the user at a design, a page or anything else outside the journal. A link the agent gives the user in the chat is pinned to the chat, so it is not lost as the chat scrolls.", """
# Pinned links

Whenever you point the user at something outside the journal, a design, a hosted page, a document, any link they
will come back to, pin it above the chat: `journal notice create "<what it is>" --link "<url>" --label "Open the design"`.
A link in your chat text or in a command's output that no pin carries, a pull request's address among them, is suggested
as a pin, and the same link again only after a stretch of your tool uses. The user closes a pin when done.

The same goes for what a subagent makes: when you dispatch one to produce something the user will open, tell it
to end its report with the link, and pin that the moment it reports, before you say anything else about its work.
""", keywords=('pin', 'pinned', 'link', 'design'))
