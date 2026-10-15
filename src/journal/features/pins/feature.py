from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.pins.commands.notice_command import NoticeCommand
from journal.features.pins.listeners.unpinned_link import UnpinnedLink
from journal.features.skill import Skill


class Pins(Feature):
    name = "pins"
    title = "Pinned links"
    help = "A link the agent gives the user is pinned above the chat, so it is not lost as the chat scrolls; the user closes it when done."
    commands = (NoticeCommand,)
    listeners = (UnpinnedLink,)

    UNPINNED = Nudge(name, "unpinned", "a link you gave in the chat is not pinned; if the user will come back to it, pin it", "{{url}}: journal notice create \"<what it is>\" --link \"{{url}}\" --label \"<Open ...>\"", repeat_after=86400)
    nudges = (UNPINNED,)

    skill = Skill("pinned-links", "Load it when you point the user at a design, a page or anything else outside the journal. A link the agent gives the user in the chat is pinned to the chat, so it is not lost as the chat scrolls.", """
# Pinned links

Whenever you point the user at something outside the journal, a design, a hosted page, a document, any link they
will come back to, pin it above the chat: `journal notice create "<what it is>" --link "<url>" --label "Open the design"`.
A link in your chat text that no pin carries earns one reminder. The user closes a pin when done.

The same goes for what a subagent makes: when you dispatch one to produce something the user will open, tell it
to end its report with the link, and pin that the moment it reports, before you say anything else about its work.
""", keywords=('pin', 'pinned', 'link', 'design'))
