from features.base import Behaviour, FeatureDetails, Line
from features.trigger import MINUTES, Trigger
from features.settings import Setting
from features.boards.resource import MEANINGS
from features.groups import Group

MODELS = ("haiku", "sonnet", "opus")


class BoardsDetails(FeatureDetails):
    name = "boards"
    group = Group.BOARDS
    skill_of = "tickets"
    when = "a board is made, its stages change, or a ticket moves between them"

    title = "Boards"

    abstract = "Named boards of tickets, each with stages of its own"

    help = f"""
        journal board create "<name>" --brief "<what it is for>" --set stages="New,Doing,Review,Done" makes one for the
        whole project. journal board stage <n> "<stage>" adds a stage, and journal board meaning <n> "<stage>" <meaning> marks
        it as one of {', '.join(MEANINGS)}: the journal acts on a stage only once it is marked. A ticket sits in one stage of
        its board: journal ticket move <n> "<stage>".

        journal board request <n> "<what is wanted>" asks for tickets on the board, as the New work panel does: it files the words
        as a message and starts the sequence Exploring a request. journal board score <n> <1-5> rates how well
        you understand the request after each answer and hands you the step for that score; at 4 you may settle the scope
        with one more question, at 5 the sequence Drafting the board's cards starts, and after five ratings below 4 the panel
        says you do not know what they want and offers to start over.

        journal board revise <n> "<the change>" is what the panel sends once drafts show: it files the words as a message and
        starts the sequence Revising the board's drafts, which changes only the cards they named.

        journal board cancel <n> answers every open question on the board with Start over, as the panel's X does; a
        request on the board does the same before it is filed.

        journal board expect <n> <count> says how many tickets you are about to draft, so the New work panel shows that many
        placeholders; guess low, since more fade in and none is taken away.

        journal board ask <n> "<question>" --set options='[...]' asks the user a question about the board: the New work
        panel shows it, and it stays out of the board itself, the chat, the Questions page and your nudges. The answer comes back as an event.

        Everything you write goes to the chat; the New work panel gets words only through its command. journal board say <n>
        "<line>" puts one short line in the panel, at most 200 characters, answering what was asked there.

        journal board update <n> --set after_merge="<command>" runs that command in the project after every ticket of the
        board that journal ticket merge lands, such as a version bump, tag and push; how it went is a comment on the ticket.
    """

    behaviours = [
        Behaviour(
            name="ideas",
            title="Suggest new work",
            abstract="Shown as chips under New work",
            trigger=Trigger(every=720, unit=MINUTES),
        ),
    ]

    settings = [
        Setting(
            name="filler_model",
            default="sonnet",
            choices=MODELS,
            title="Board filler model",
        ),
        Setting(
            name="reviewer_model",
            default="sonnet",
            choices=MODELS,
            title="Reviewer model",
        ),
        Setting(
            name="orchestrating",
            default=False,
            title="This environment orchestrates its boards",
            abstract="On: its agent only delegates",
        ),
    ]

    lines = [
        Line(
            name="ideas",
            title="think up what the user might ask for on board {{n}}, {{title}}",
            brief="""
                read its goal and cards (journal board show {{n}}), then write 3 to 5 short things the user might ask for
                next, each one chip of at most 60 characters, in the user's words: journal board ideas {{n}} "<idea>" "<idea>"
                "<idea>". They replace the board's ideas under New work.
            """,
        ),
        Line(
            name="added",
            title="the user added {{count}} cards to board {{n}}, {{title}}",
            brief="""
                they are {{tickets}}. Say in the chat in one line that they are in To do and that Play runs them, with a
                Play button: journal message create "{{count}} cards are in To do" --brief "Press Play and I'll run them, each
                with its own agent in its own worktree." --set buttons='[{"label": "Play", "type": "board", "n": {{n}}, "action": "start",
                "choice": "play"}, {"label": "Not now", "say": "Not now", "choice": "play"}]'.{{uncovered}}
            """,
        ),
    ]
