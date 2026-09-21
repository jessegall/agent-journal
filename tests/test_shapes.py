from controllers.types import Questions, Todos
from engine.manifest import manifest
from resources.base import USER
from resources.shapes import FLAG, Field, Options, Reasoned, Shape
from resources.types import TYPES
from tests.conftest import fresh, refused


def test_every_type_is_shaped_fields_and_labels_gathered_from_its_mixins():
    for name, t in TYPES.items():
        assert (isinstance(t.fields, dict), isinstance(t.labels, dict)) == (True, True), f"{name}: has fields and labels"
    shared = [n for n, t in TYPES.items() if Options in t.__mro__]
    reasoned = sorted(n for n, t in TYPES.items() if Reasoned in t.__mro__)
    assert shared == ["question", "suggestion"], "options belong to questions and suggestions"
    assert reasoned == ["fact", "rule"], "facts and rules share one reasoning shape"
    assert TYPES["fact"].labels == {"brief": "Reasoning", "outcome": "Why struck"}, "the reasoning shape names the brief and the strike"
    assert (TYPES["fact"].labels == TYPES["rule"].labels) is True, "a shape declared once is the same object on both"

    class Twice(Options, Reasoned, Shape):
        extra = Field(FLAG)

    assert (Twice.extra, Twice.fields["extra"]) == ("extra", FLAG), "a Field with a spec is a typed field, read on the class as its name"
    assert (sorted(Twice.fields), Twice.labels) == (["extra", "keywords", "options", "pick"], {"brief": "Reasoning", "outcome": "Why struck"}), \
        "shapes compose: fields and labels from every mixin plus its own"

    record = fresh()
    questions = Questions(record, actor=USER)
    q = questions.create("which way", options=[{"title": "left", "description": "shorter"}, {"title": "right"}], pick=1, anything="free")
    assert (q.data["options"][1], q.data["pick"], q.data["anything"]) == ({"title": "right"}, 1, "free"), \
        "well-shaped options and a pick are kept, and free data too"
    assert refused(lambda: questions.create("q", options="left, right")) == "options is a list of rows", "options that are not rows are refused"
    assert refused(lambda: questions.create("q", options=[{"title": 3}])) == "options.title is a text", "a row's column of the wrong kind is refused"
    assert refused(lambda: questions.update(q.n, pick="first")) == "pick is a number", "a pick that is not a number is refused"
    assert (refused(lambda: Todos(record).create("t")) == "" and "flag" in str(Twice.fields["extra"])) is True, "a flag takes only a bool"

    m = manifest()
    assert m["types"]["question"]["fields"] == Options.fields, "the manifest says a question's fields"
    assert m["types"]["fact"]["labels"] == {"brief": "Reasoning", "outcome": "Why struck"}, "the manifest says a pin's labels"
