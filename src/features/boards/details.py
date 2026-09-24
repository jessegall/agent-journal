from features.base import FeatureDetails
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
        as a message and starts the sequence Working a card from the board, whose steps say how to answer it.

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
