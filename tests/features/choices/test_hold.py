import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Questions  # noqa: E402
from features.choices.feature import offers_choices  # noqa: E402
from engine.hooks import gate_file  # noqa: E402
from resources.base import AGENT  # noqa: E402
from tests.features.kit import idle, nudges  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

check("a numbered list with a question offers choices", offers_choices("Which do you want?\n1. the blue one\n2. the red one"), True)
check("lettered options too", offers_choices("Should I:\nA) merge now\nB) wait for CI"), True)
check("a list that asks nothing is a list", offers_choices("Done:\n- built\n- tested"), False)
check("a question without options is fine", offers_choices("Shall I merge it?"), False)

record = fresh()
transcript = record.root / "runtime" / "t.jsonl"
transcript.parent.mkdir(parents=True, exist_ok=True)


def said(text):
    transcript.write_text(json.dumps({"type": "assistant", "message": {"role": "assistant", "content": [{"type": "text", "text": text}]}}) + "\n")


def holds():
    f = gate_file(record.root, record.env, "claude-1")
    return json.loads(f.read_text()) if f.is_file() else {}


said("[!reply] Which do you want?\n1. the blue one\n2. the red one")
idle(record, provider="claude", transcript=str(transcript))
check("choices in prose: the agent is told once, and its writes are held", ([n for n in nudges(record) if "choices in prose" in n], bool(holds().get("choices"))), (["your last message offers choices in prose"], True))
Questions(record, actor=AGENT).create("Which one?", options=[{"title": "the blue one", "description": "", "code": ""}, {"title": "the red one", "description": "", "code": ""}], pick=1)
check("a question asked properly lifts the hold", holds().get("choices", ""), "")

done()
