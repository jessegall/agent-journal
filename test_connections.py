#!/usr/bin/env python3
import json, os, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import connections, state, testkit  # noqa: E402
from datetime import datetime, timezone  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


def now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


d = Path(tempfile.mkdtemp()) / "proj"
(d / ".claude").mkdir(parents=True)
testkit.make(d, SRC)
(d / ".journal" / "settings.json").write_text(json.dumps({"silenced": ["loop"], "one_session_per_environment": False}))
root = d / ".journal"

# ------------------------------------------------------------------ the project keeps a list
took, why = connections.add(root, "sentry", "errors and releases for the viewer", now(),
                            kind="sentry", url="https://sentry.io/api/0/", secret="SENTRY_AUTH_TOKEN")
check("a connection is kept", (took, "sentry" in why), (True, True))
check("and it is in the list", sorted(connections.all_of(root, "default")), ["sentry"])
took, why = connections.add(root, "sentry", "again", now())
check("the same name twice is refused", (took, "is already kept" in why), (False, True))
took, why = connections.add(root, "bare", "", now())
check("one with nothing to say it is for is refused", (took, "what it is for" in why), (False, True))

# ------------------------------------------------------------------ the secret is a NAME
for value, label in (("sntrys_eyJpYXQiOjE3MDB9_abcdefgh", "a vendor prefix"),
                     ("ghp_0123456789abcdefghijklmnop", "a github token"),
                     ("x" * 70, "something far too long"),
                     ("not a variable name", "spaces")):
    took, why = connections.set_field(root, "sentry", "secret", value)
    check(f"a secret that is {label} is refused where it is typed",
          (took, "ENVIRONMENT VARIABLE" in why), (False, True))
check("and the one that was set is untouched",
      connections.one(root, "sentry", "default")["secret"], "SENTRY_AUTH_TOKEN")
took, _ = connections.add(root, "posted", "webhooks", now(), secret="ghp_0123456789abcdefghij")
check("a token handed to `add` is refused there too", took, False)
check("so nothing was kept under that name", connections.one(root, "posted", "default"), None)

# whether the variable is set is answerable; what is in it is not this record's business
os.environ["SENTRY_AUTH_TOKEN"] = "a value nobody here may print"
check("the state of the secret is whether the variable is set",
      connections.secret_state(connections.one(root, "sentry", "default")),
      "SENTRY_AUTH_TOKEN is set in this shell")
del os.environ["SENTRY_AUTH_TOKEN"]
check("and it never carries the value",
      "a value nobody here may print" in connections.secret_state(connections.one(root, "sentry", "default")), False)

# ------------------------------------------------------------- an environment may disagree
took, why = connections.override(root, "staging", "sentry", "url", "https://sentry.io/api/0/staging/")
check("one field is overridden on one environment", (took, "for the project" in why), (True, True))
row = connections.one(root, "sentry", "staging")
check("that environment reads its own", row["url"], "https://sentry.io/api/0/staging/")
check("and what it changed it from is beside it",
      (row["overridden"], row["project"]["url"]), (["url"], "https://sentry.io/api/0/"))
check("everything else is still the project's", row["kind"], "sentry")
check("another environment is untouched",
      (connections.one(root, "sentry", "default")["url"], connections.one(root, "sentry", "default")["overridden"]),
      ("https://sentry.io/api/0/", []))
took, why = connections.override(root, "staging", "sentry", "url", "", off=True)
check("--off puts that one field back", (took, connections.one(root, "sentry", "staging")["url"]),
      (True, "https://sentry.io/api/0/"))
took, why = connections.override(root, "staging", "sentry", "url", "", off=True)
check("and there is nothing left to put back", (took, "nothing overridden" in why), (False, True))
took, why = connections.override(root, "staging", "gone", "url", "x")
check("an override of a connection the project does not keep is refused",
      (took, "no connection named" in why), (False, True))
took, why = connections.set_field(root, "sentry", "colour", "blue")
check("a field a connection does not have is refused", (took, "not 'colour'" in why), (False, True))
took, why = connections.set_field(root, "sentry", "for", "errors, and releases")
check("`for` is the word the sentence wants, and it reaches `purpose`",
      (took, connections.one(root, "sentry", "default")["purpose"]), (True, "errors, and releases"))

# ------------------------------------------------------------------ nothing goes without a note
took, why = connections.remove(root, "sentry", "", now())
check("removing one with no reason is refused", (took, "say why" in why), (False, True))
took, why = connections.remove(root, "sentry", "the account is gone", now())
check("with a reason it goes", (took, connections.all_of(root, "default")), (True, {}))
gone = state.get(root, connections.GONE, []) or []
check("and the record says what went and why, in a log of its own",
      (len(gone), gone[0]["name"], gone[0]["why"], gone[0]["was"]["url"]),
      (1, "sentry", "the account is gone", "https://sentry.io/api/0/"))

# ------------------------------------------------ a token in ANY field is a token that has leaked
# The secret field was the only one checked, and the record does not care which field it is in: every
# one of them is read back verbatim into every session and subagent.
took, why = connections.add(root, "sentry-two", "error reports", now(),
                            url="https://sentry.io/api?key=sk-live-9a8b7c6d5e4f", secret="SENTRY_TOKEN")
check("a token inside the url is refused, naming the field",
      (took, "url of sentry-two appears to carry a token" in why), (False, True))
connections.add(root, "leaky", "the one this block writes to", now(), url="https://api.example.com")
took, why = connections.set_field(root, "leaky", "purpose", "error reports, auth ghp_AbCdEf123456")
check("and one inside the purpose is refused too",
      (took, "purpose of leaky appears to carry a token" in why), (False, True))
check("an ordinary url is untouched",
      connections.set_field(root, "leaky", "url", "https://sentry.io/organizations/acme")[0], True)
check("and a word that merely starts like one is not a token",
      connections.set_field(root, "leaky", "purpose", "error reports, risk-averse by default")[0], True)
check("an environment's own override is checked the same way",
      connections.override(root, "default", "leaky", "url", "https://sentry.io/api?key=sk-live-9a8b")[0], False)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
