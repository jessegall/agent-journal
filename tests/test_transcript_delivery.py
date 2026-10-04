import json
import time
from types import SimpleNamespace

from engine.transcript import AGENT, Turn
from providers.base import Provider, RECENT
from runner import hooks


def test_recent_retries_a_record_unfinished_on_first_read(tmp_path):
    path = tmp_path / "transcript.jsonl"
    path.write_bytes(b'{"answer": 1}\n{"answer": ')
    RECENT.pop(str(path), None)
    provider = SimpleNamespace(row_of=lambda row: row)

    assert Provider.recent(provider, path) == [{"answer": 1}]
    assert RECENT[str(path)][0] == len(b'{"answer": 1}\n')

    with path.open("ab") as target:
        target.write(b'2}\n')

    assert Provider.recent(provider, path) == [{"answer": 1}, {"answer": 2}]
    RECENT.pop(str(path), None)


def test_unfinished_delivers_answers_on_its_first_call(tmp_path, monkeypatch):
    turns = [Turn(1, AGENT, "An answer", at=time.time())]
    monkeypatch.setitem(hooks.PROVIDERS, "sample", lambda: SimpleNamespace(tail=lambda path: turns))
    sent = []
    monkeypatch.setattr(hooks, "send_to_chat", lambda root, session, text, turn: sent.append((text, turn)))
    row = SimpleNamespace(provider="sample", transcript=tmp_path / "transcript.jsonl")

    hooks.unfinished(tmp_path, "session", row)

    assert sent == [("An answer", "transcript:1")]
    state = json.loads(hooks.runtime.session_file(tmp_path, "session", "displayed.json").read_text())
    assert state[hooks.SENT] == []


def test_send_to_chat_records_delivery_only_after_a_row_and_send(tmp_path, monkeypatch):
    state = {"row": None}
    sent = []
    monkeypatch.setattr(hooks, "Record", lambda root, env: SimpleNamespace(root=root, env=env))
    monkeypatch.setattr(hooks, "Sessions", lambda root: SimpleNamespace(environment=lambda session: "env"))
    monkeypatch.setattr(hooks, "Agents", lambda record, actor: SimpleNamespace(_titled=lambda session: state["row"]))
    path = hooks.runtime.session_file(tmp_path, "session", "displayed.json")

    def send(record, row, text):
        sent.append(text)
        assert hooks.fingerprint(text) not in hooks.read_json(path, dict, {}).get(hooks.SENT, [])

    monkeypatch.setattr(hooks.chat, "send", send)
    hooks.send_to_chat(tmp_path, "session", "An answer")
    assert not path.exists()

    state["row"] = SimpleNamespace(n=1)
    hooks.send_to_chat(tmp_path, "session", "An answer")
    hooks.send_to_chat(tmp_path, "session", "An answer")

    assert sent == ["An answer"]
    assert hooks.read_json(path, dict, {})[hooks.SENT] == [hooks.fingerprint("An answer")]
