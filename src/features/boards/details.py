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

        journal board ask <n> "<question>" --set options='[...]' asks the user a question about the board: the board shows
        it at its top, and it stays out of the chat, the Questions page and your nudges. The answer comes back as an event.
    """
