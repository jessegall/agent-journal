from features.base import FeatureDetails, Line
from features.settings import Setting
from features.boards.resource import MEANINGS


class BoardsDetails(FeatureDetails):
    name = "boards"
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
    """

    settings = [
        Setting(
            name="filler_model",
            default="sonnet",
            title="Model of the agent that fills a board",
            abstract="The board-filler asks, drafts and hands the cards over; it needs quick reasoning more than deep logic",
        ),
        Setting(
            name="reviewer_model",
            default="sonnet",
            title="Model of the agents that review plans, tickets and the board's goal",
        ),
    ]

    lines = [
        Line(
            name="added",
            title="the user added {{count}} cards to board {{n}}, {{title}}",
            brief="""
                they are {{tickets}}. Say in the chat in one line that they are in To do and that Play runs them, with a
                Play button: journal message create "{{count}} cards are in To do. Press Play and I'll run them, each with its own
                agent in its own worktree." --set buttons='[{"label": "Play", "type": "board", "n": {{n}}, "action": "start",
                "choice": "play"}, {"label": "Not now", "say": "Not now", "choice": "play"}]'.{{uncovered}}
            """,
        ),
    ]
