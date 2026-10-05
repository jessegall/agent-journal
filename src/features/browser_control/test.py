import features
from commands.http import dispatch
from features.browser_control.controller import Asks
from resources.base import AGENT
from tests.conftest import fresh, refused


def test_the_extension_drives_a_tab_answers_an_ask_and_its_picture_is_attached():
    features.load()
    record = fresh()
    sent = lambda path, body: dispatch("POST", f"/api/{record.env}/browser/{path}", record.root, {}, body)
    agent = Asks(record, actor=AGENT)
    assert "no tab is being driven" in refused(lambda: agent.ask("text", wait=0)), "with no tab driven an ask is refused, not left waiting"
    sent("driver", {"on": True, "url": "https://example.org", "title": "Example"})
    asked = agent.ask("shot", wait=0)
    assert [row["n"] for row in sent("pending", {}).body["data"]] == [asked.n], "the extension is handed the waiting ask"
    sent(f"{asked.n}/result", {"text": "a picture of the page", "files": [{"name": "../shot.png", "data": "data:image/png;base64,iVBORw0KGgo="}]})
    done = agent.load(asked.n)
    assert (bool(done.completed), done.outcome, agent.files(asked.n)) == (True, "a picture of the page", ["shot.png"]), \
        "the answer closes the ask with its text and attaches its picture, under its own name only"
    assert sent("pending", {}).body["data"] == [], "an answered ask is no longer handed out"
