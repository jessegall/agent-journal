import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import Questions, Todos  # noqa: E402
from engine.manifest import manifest  # noqa: E402
from resources.base import USER  # noqa: E402
from resources.shapes import FLAG, Field, Options, Reasoned, Shape  # noqa: E402
from resources.types import TYPES  # noqa: E402
from tests.kit import check, done, fresh, refused  # noqa: E402



# EVERY TYPE IS SHAPED: fields and labels gathered from its mixins, empty where it declares none
for name, t in TYPES.items():
    check(f"{name}: has fields and labels", (isinstance(t.fields, dict), isinstance(t.labels, dict)), (True, True))
shared = [n for n, t in TYPES.items() if Options in t.__mro__]
reasoned = sorted(n for n, t in TYPES.items() if Reasoned in t.__mro__)
check("options belong to the question", shared, ["question"])
check("pins, rules and style rules share one reasoning shape", reasoned, ["pin", "rule", "style"])
check("the reasoning shape names the brief and the strike", TYPES["pin"].labels, {"brief": "Reasoning", "outcome": "Why struck"})
check("a shape declared once is the same object on both", TYPES["pin"].labels == TYPES["rule"].labels, True)


class Twice(Options, Reasoned, Shape):
    extra = Field(FLAG)


check("a Field with a spec is a typed field, read on the class as its name", (Twice.extra, Twice.fields["extra"]), ("extra", FLAG))
check("shapes compose: fields and labels from every mixin plus its own", (sorted(Twice.fields), Twice.labels), (["extra", "options", "pick"], {"brief": "Reasoning", "outcome": "Why struck"}))

# THE CONTROLLER VALIDATES what a type's shape declares, and leaves the rest of data free
record = fresh()
questions = Questions(record, actor=USER)
q = questions.create("which way", options=[{"title": "left", "description": "shorter"}, {"title": "right"}], pick=1, anything="free")
check("well-shaped options and a pick are kept, and free data too", (q.data["options"][1], q.data["pick"], q.data["anything"]), ({"title": "right"}, 1, "free"))
check("options that are not rows are refused", refused(lambda: questions.create("q", options="left, right")), "options is a list of rows")
check("a row's column of the wrong kind is refused", refused(lambda: questions.create("q", options=[{"title": 3}])), "options.title is a text")
check("a pick that is not a number is refused", refused(lambda: questions.update(q.n, pick="first")), "pick is a number")
check("a flag takes only a bool", refused(lambda: Todos(record).create("t")) == "" and "flag" in str(Twice.fields["extra"]), True)

# THE MANIFEST carries every type's fields and labels
m = manifest()
check("the manifest says a question's fields", m["types"]["question"]["fields"], Options.fields)
check("the manifest says a pin's labels", m["types"]["pin"]["labels"], {"brief": "Reasoning", "outcome": "Why struck"})

done()
