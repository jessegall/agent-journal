import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Works  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from resources.base import AGENT  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
root, env = record.root, record.env
REFUSED = 'nothing is open, so this write would not be filed: journal work start "<the work>" first'

for name, provider_cls in PROVIDERS.items():
    provider = provider_cls()
    session = f"{name}-7"

    def hook(event, tool="", **tool_input):
        return provider.handle(root, env, {"hook_event_name": event, "session_id": session, "tool_name": tool, "tool_input": tool_input})

    # THE HOOK REPORTS, AND READS ONE FLAG; the gate feature writes it from work events
    hook("SessionStart")
    check(f"{name}: a fresh session with nothing open: the flag says refused", provider.gate(root, env, session), REFUSED)
    check(f"{name}: a read passes", hook("PreToolUse", "Read", file_path="x.py"), {})
    check(f"{name}: a Bash read passes", hook("PreToolUse", "Bash", command="cat x.py | grep y"), {})
    check(f"{name}: an edit is refused, in the harness's shape", hook("PreToolUse", "Edit", file_path="x.py"), {"decision": "block", "reason": REFUSED})
    check(f"{name}: a writing command is refused", hook("PreToolUse", "Bash", command="git commit -m x"), {"decision": "block", "reason": REFUSED})
    check(f"{name}: a redirect is a write", hook("PreToolUse", "Bash", command="echo x > out.txt"), {"decision": "block", "reason": REFUSED})
    check(f"{name}: a redirect to /dev/null is not", hook("PreToolUse", "Bash", command="make > /dev/null"), {})
    check(f"{name}: joining stderr is not a write", hook("PreToolUse", "Bash", command="python3 tests/x.py 2>&1 | tail -1"), {})
    check(f"{name}: a journal command is never gated, it is how work opens", hook("PreToolUse", "Bash", command="journal work start \"x\" >/dev/null; .journal/journal todo add x"), {})
    work = Works(record, actor=AGENT).create(f"the header for {name}")
    check(f"{name}: work open: the flag flips to allowed", provider.gate(root, env, session), "")
    check(f"{name}: the same edit passes", hook("PreToolUse", "Edit", file_path="x.py"), {})
    Works(record, actor=AGENT).complete(work.n, "done")
    check(f"{name}: work ended, nothing open: refused again", hook("PreToolUse", "Write", file_path="y.py"), {"decision": "block", "reason": REFUSED})
    check(f"{name}: the flag is a file per environment and session, with the why", json.loads((root / "runtime" / f"gate-{env}-{session}.json").read_text())["gate"], REFUSED)

done()
