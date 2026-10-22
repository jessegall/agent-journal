from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.features.pins.commands.notice_command import NoticeCommand
from journal.features.pins.listeners.dock_new_writing import DockNewWriting
from journal.features.pins.pins_conduct import PinsConduct
from journal.features.pins.support.pins_data_reader import PinsDataReader
from journal.features.pins.support.pins_data import PinsData
from journal.support.option import Option
from journal.support.skill import Skill


class Pins(Feature[PinsData]):
    PIN_SUGGESTION_INTERVAL = Option("pins.suggest_every", "Suggest an unpinned link again after", "The agent's tool uses before a link it has not pinned is suggested again", 50, unit="tool uses")
    name = "pins"
    title = "Pinned links"
    help = "A link the agent gives the user is pinned above the chat, so it is not lost as the chat scrolls; the user closes it when done."
    commands = (NoticeCommand,)
    listeners = (DockNewWriting,)
    options = (PIN_SUGGESTION_INTERVAL,)
    data = (PinsDataReader,)
    conduct = (PinsConduct,)

    LINK_PIN_REQUEST = Nudge(name, "pin_the_link", "{{url}} is not pinned; if the user will come back to it, pin it", "`journal notice create \"<what it is>\" --link \"{{url}}\" --label \"<Open ...>\"`", repeat_interval=0)
    nudges = (LINK_PIN_REQUEST,)

    skill = Skill("pinned-links", "Load it when you point the user at a design, a page or anything else outside the journal. A link the agent gives the user in the chat is pinned to the chat, so it is not lost as the chat scrolls.", """
# Pinned links

Whenever you point the user at something outside the journal, a design, a hosted page, a document, any link they
will come back to, pin it above the chat: `journal notice create "<what it is>" --link "<url>" --label "Open the design"`.
A row of the journal, a document or a plan you want kept in view, is pinned by its ref, `--link docs:55`, and its
button opens the row in place, as a click on its card does; an outside address opens in a new tab.
A link in your chat text or in a command's output that no pin carries, a pull request's address among them, is suggested
as a pin, and the same link again only after a stretch of your tool uses. The user closes a pin when done.

The same goes for what a subagent makes: when you dispatch one to produce something the user will open, tell it
to end its report with the link, and pin that the moment it reports, before you say anything else about its work.
""", keywords=('pin', 'pinned', 'link', 'design'))
