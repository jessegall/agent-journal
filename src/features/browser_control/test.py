import features
from commands.http import dispatch
from controllers.browser_control import Asks
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
    assert "an ask is one of" in refused(lambda: agent.ask("fly")), "an ask the extension does not know is refused with the ones it does"
    waiting = agent.ask("text", wait=1)
    assert not waiting.completed, "an ask nobody answers in time comes back still waiting"


def test_the_journals_own_extension_may_post_and_no_other_page_or_extension_may():
    from types import SimpleNamespace
    import serve
    handler = SimpleNamespace(server=SimpleNamespace(server_port=8420))
    trusted = lambda origin: serve.Handler.trusted_origin(handler, origin)
    assert (trusted(serve.EXTENSION_ORIGIN), trusted("chrome-extension://abcdefghijklmnopabcdefghijklmnop"), trusted("https://example.com")) == (True, False, False), \
        "the extension's posts, a picked element's picture among them, are let in by its fixed ID, and nothing else that is not the viewer"
