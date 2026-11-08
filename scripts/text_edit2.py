from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def replaced(path: str, old: str, new: str) -> None:
    file = ROOT / path
    text = file.read_text()
    assert old in text, (path, old)
    file.write_text(text.replace(old, new, 1))


declaration = "src/core/base/viewer/inspector_declaration.py"
replaced(declaration, "whether it lists the row's text above its parts, which an inspector\n    whose part draws the text itself does not.", "whether a part of it draws the row's text itself, so the inspector does\n    not draw it above its parts.")
replaced(declaration, "    lists_text: bool = True\n", "    draws_text: bool = False\n")
replaced(declaration, 'lists_text=stored.get("lists_text", True))', 'draws_text=stored.get("draws_text", False))')
replaced("src/core/base/registry/inspector_listing.py", "    lists_text: bool = True\n", "    draws_text: bool = False\n")
replaced("src/core/base/registry/inspector_listing.py", "whether it lists the row's text.", "whether a part of it draws the row's text.")
replaced("src/core/base/registry/inspector_entry.py", "declaration.lists_text)", "declaration.draws_text)")
replaced("src/core/modules/documents/support/text_inspectors.py", "        lists_text=False,\n", "        draws_text=True,\n")
viewer = "src/viewer/src/resource/Inspector.vue"
replaced(viewer, "shareable: false, lists_fields: true, lists_text: true,", "shareable: false, lists_fields: true, draws_text: false,")
replaced(viewer, '<template v-if="html && listing.lists_text">', '<template v-if="html && !listing.draws_text">')
replaced("tests/stories/core/base/viewer/inspector_listing.py", '''def test_an_inspector_whose_part_draws_the_text_does_not_list_it_too(new_story):
    listed = inspectors_of(new_story(fixture=MainEnvironment))
    assert {noun: listed[noun].lists_text for noun in ("doc", "report", "task", "memory")} == {"doc": False, "report": False, "task": True, "memory": True}''', '''def test_an_inspector_whose_part_draws_the_text_says_so(new_story):
    listed = inspectors_of(new_story(fixture=MainEnvironment))
    assert {noun: listed[noun].draws_text for noun in ("doc", "report", "task", "memory")} == {"doc": True, "report": True, "task": False, "memory": False}''')
print("done", flush=True)
