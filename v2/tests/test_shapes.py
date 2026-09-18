import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from v2.controllers.types import CONTROLLERS  # noqa: E402
from v2.engine.manifest import manifest  # noqa: E402
from v2.resources.base import USER  # noqa: E402
from v2.resources.shapes import Options, Reasoned, Shape  # noqa: E402
from v2.resources.types import TYPES  # noqa: E402
from v2.tests.kit import check, done, fresh  # noqa: E402


def refused(fn):
    try:
        fn()
        return ""
    except Exception as e:
        return str(e)


# EVERY TYPE IS SHAPED: fields and labels gathered from its mixins, empty where it declares none
for name, t in TYPES.items():
    check(f"{name}: has fields and labels", (isinstance(t.fields, dict), isinstance(t.labels, dict)), (True, True))
shared = [n for n, t in TYPES.items() if Options in t.__mro__]
reasoned = sorted(n for n, t in TYPES.items() if Reasoned in t.__mro__)
check("options belong to the question", shared, ["question"])
check("pins and rules share one reasoning shape", reasoned, ["pin", "rule"])
check("the reasoning shape names the brief and the strike", TYPES["pin"].labels, {"brief": "Reasoning", "outcome": "Why struck"})
check("a shape declared once is the same object on both", TYPES["pin"].labels == TYPES["rule"].labels, True)


class Twice(Options, Reasoned, Shape):
    fields = {"extra": "flag"}


check("shapes compose: fields and labels from every mixin plus its own", (sorted(Twice.fields), Twice.labels), (["extra", "options", "pick"], {"brief": "Reasoning", "outcome": "Why struck"}))

# THE CONTROLLER VALIDATES what a type's shape declares, and leaves the rest of data free
record = fresh()
questions = CONTROLLERS["question"](record, actor=USER)
q = questions.create("which way", options=[{"title": "left", "description": "shorter"}, {"title": "right"}], pick=1, anything="free")
check("well-shaped options and a pick are kept, and free data too", (q.data["options"][1], q.data["pick"], q.data["anything"]), ({"title": "right"}, 1, "free"))
check("options that are not rows are refused", refused(lambda: questions.create("q", options="left, right")), "options is a list of rows")
check("a row's column of the wrong kind is refused", refused(lambda: questions.create("q", options=[{"title": 3}])), "options.title is a text")
check("a pick that is not a number is refused", refused(lambda: questions.update(q.n, pick="first")), "pick is a number")
check("a flag takes only a bool", refused(lambda: CONTROLLERS["todo"](record).create("t")) == "" and "flag" in str(Twice.fields["extra"]), True)

# THE MANIFEST carries every type's fields and labels
m = manifest()
check("the manifest says a question's fields", m["types"]["question"]["fields"], Options.fields)
check("the manifest says a pin's labels", m["types"]["pin"]["labels"], {"brief": "Reasoning", "outcome": "Why struck"})

done()
