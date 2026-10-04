from controllers.types import Agents, Messages, Nudges
from engine import chat
from resources.base import SYSTEM
from tests.conftest import fresh
from tests.kit import report


def test_an_acknowledgement_of_a_delivered_line_is_kept_out_of_the_chat_unless_its_answer_must_be_read():
    record = fresh()
    report(record, "idle", "Stop")
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session("claude-1")
    nudges = Nudges(record, actor=SYSTEM)
    plain, kept = nudges.create("a reminder"), nudges.create("plan 3 stands still", reply_kept=True)

    def answered(text, prompted="journal", delivered=(f"nudge:{plain.n}",), failure=""):
        agents.update(row.n, prompted=prompted, delivered=list(delivered), failure=failure)
        chat.send(record, agents.load(row.n), text)
        found = [m for m in Messages(record).all() if m.brief == text]
        return [bool(m.data.get("acknowledgement")) for m in found]

    assert answered("Noted.") == [True], "a bare acknowledgement of a journal line is kept as a message the chat leaves out"
    assert answered("Carrying on with it.", delivered=(f"nudge:{kept.n}",)) == [False], "a line whose answer must be read keeps the answer in the chat"
    assert answered("Okay, on it.", delivered=("message:7",)) == [False], "an answer to a message is never hidden"
    assert answered("Understood.", prompted="person") == [False], "a turn the person started is never hidden"
    assert answered("Done.", failure="the turn failed") == [False], "a failed turn is never hidden"
    assert answered("Fixed the build and pushed it to main.") == [False], "a turn that says something is never hidden"
    assert answered("Got it, but which branch should I use?") == [False], "a question is never hidden"
