from events.asking import RowWriting
from features.boards.drafting import BUILDING_A_BOARD, DRAFTING, DRAFTING_FROM_A_DOCUMENT, REVISING_THE_DRAFTS
from features.boards.exploration import EXPLORATION, FILLER
from receiving import Refuser
from resources.base import AGENT, Refused
from resources.boards import PANEL_REPLY
from resources.types import Board, Message, Sequence
from serving import ReadRows

BOARD_SEQUENCES = {shipped.title for shipped in (EXPLORATION, DRAFTING, REVISING_THE_DRAFTS, DRAFTING_FROM_A_DOCUMENT, BUILDING_A_BOARD)}
HELD = ("plan", "question")
FILLER_WRITES = ("board", "ticket", "sequence", "question", "comment", "message")


def filling(agent: str, sequences: ReadRows[Sequence]) -> str:
    if agent == FILLER:
        return FILLER
    found = sequences.in_hand()
    return found[0].title if found and found[0].title in BOARD_SEQUENCES else ""


class BoardWorkStaysOnTheBoard(Refuser[RowWriting]):
    def refuse(self, event: RowWriting, sequences: ReadRows[Sequence]) -> None:
        if event.actor != AGENT or event.action != "create" or event.type not in HELD or dict(event.fields).get("hidden"):
            return
        if running := filling(event.agent, sequences):
            raise Refused(f"the {running} is filling the board: the work goes on its board, so ask with journal board ask "
                          f"and draft tickets with journal ticket create; no {event.type} of its own")


class PanelRepliesStayShort(Refuser[RowWriting]):
    def refuse(self, event: RowWriting, messages: ReadRows[Message], boards: ReadRows[Board]) -> None:
        fields = dict(event.fields)
        about = str(fields.get("about", ""))
        if event.type != "comment" or event.action != "create" or event.actor != AGENT or not about.startswith("message:"):
            return
        if not boards.of_message(messages.peek(about.split(":")[1])):
            return
        text = "\n".join(line for line in (fields.get("brief") or "").split("\n") if not line.startswith(">")).strip()
        if len(text) > PANEL_REPLY:
            raise Refused(f"your reply to the board is {len(text)} characters, and the New work panel shows one short line of at most "
                          f"{PANEL_REPLY}: say it again, shorter, about the tickets only")


class FillerKeepsToTheBoard(Refuser[RowWriting]):
    def refuse(self, event: RowWriting) -> None:
        if event.agent != FILLER or event.action not in ("create", "update", "complete") or event.type in FILLER_WRITES:
            return
        raise Refused(f"the board's agent writes cards, never a {event.type}: draft the request as a card with journal ticket create "
                      f'"<title>" --abstract "<one line>" --set board=<n> --set draft=true, or revise one with journal ticket update <n>')
