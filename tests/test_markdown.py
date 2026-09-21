import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = '''
import "./web/src/text/all.js";
import {render} from "./web/src/text/index.js";
const ctx = {types: [{name: "todo", title: "To-do"}], env: "main"};
console.log(JSON.stringify({
    blocks: render("# Title\\n\\nA *word* and **bold** with `x < y`.\\n\\n- one\\n- two\\n\\n1. first\\n2. second\\n\\n```\\nraw <b>\\n```\\n\\n> quoted", ctx),
    table: render("| a | b |\\n|---|---|\\n| 1 | to-do 75 |", ctx),
    plain: render("just text\\nnext line", ctx),
    files: ["a bare .md here", "see notes/.md too", "open README.md", "the .gitignore file", "edit web/src/text/files.js"].map((t) => render(t, ctx)),
    console: render("TypeError: first\\n    at one (app.js:1:2)\\nRangeError: second\\n    at two (app.js:3:4)", ctx),
    chat: [
        render("read the room.\\n\\nreturn [*automatic, *args] if x.get(\\"auto\\", False) else args\\n\\nYou fix one thing.", ctx),
        render("Try this:\\n```py\\ndef f(x):\\n    return x\\n```\\nok?", ctx),
        render("const a = 1;\\nconst b = a + 2;", ctx),
        render("I think it is fine, honestly. Nothing to do here.", ctx),
    ].map((h) => h.replace(/<span class="tok-\\w+">|<\\/span>/g, "")),
    indented: render("Four stages:\\n\\n    1  RECORD    base.py     lands on the ring\\n           |\\n    2  DISSECT   dissect.py  taken apart\\n\\nlast word.", ctx).replace(/<span class="tok-\\w+">|<\\/span>/g, ""),
}));
'''


def test_markdown_renders_headings_lists_fences_quotes_tables_and_pills():
    got = json.loads(subprocess.run(["node", "--input-type=module", "-e", SCRIPT], cwd=ROOT, text=True, capture_output=True, check=True, timeout=60).stdout)
    assert got["blocks"] == \
        '<h3>Title</h3><p>A <em>word</em> and <strong>bold</strong> with <code>x &lt; y</code>.</p><ul><li>one</li><li>two</li></ul><ol><li>first</li><li>second</li></ol><pre class="chat-code"><code>raw &lt;b&gt;</code></pre><blockquote><p>quoted</p></blockquote>', \
        "headings, emphasis, code spans, lists, fences and quotes"
    assert got["table"] == \
        '<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>1</td><td><a class="row-pill" href="#" data-peek="todo:75">to-do 75</a></td></tr></tbody></table>', \
        "a table, with the record's refs still turned into pills inside cells"
    assert [("file-pill" in h) for h in got["files"]] == [False, False, True, True, True], \
        "a bare extension is no file; a name, a path and a dotfile are"
    assert got["indented"] == \
        '<p>Four stages:</p><pre class="chat-code"><code>    1  RECORD    base.py     lands on the ring\n           |\n    2  DISSECT   dissect.py  taken apart</code></pre><p>last word.</p>', \
        "an indented block is one code block, first line and all"
    assert got["plain"] == "<p>just text<br>next line</p>", "plain lines are one paragraph with breaks"
    assert (
        '<summary><span class="console-more-collapsed">Show all 2 errors</span><span class="console-more-expanded">Show fewer errors</span></summary>' in got["console"],
        '<div class="console-entry"><div class="console-head">TypeError: first</div>' in got["console"],
    ) == (True, True), "console errors keep both collapse labels in the formatter output"
    turn = (ROOT / "web/src/chat/Turn.vue").read_text()
    assert (
        ".console-more[open] summary" not in turn,
        ".console-more[open] .console-more-collapsed" in turn,
        ".console-more[open] .console-more-expanded" in turn,
    ) == (True, True, True), "the viewer keeps the native console summary visible while switching its label"
    thread = (ROOT / "web/src/chat/Thread.vue").read_text()
    assert (
        "const hasParent = (c)" in thread,
        ".filter((c) => !c.deleted && hasParent(c))" in thread,
    ) == (True, True), "the chat includes comments on any supported resource"
    assert (
        'const messageReply = computed(() => commentParent.value?.type === "message");' in turn,
        "'comment-origin': resourceComment" in turn,
        "resourceComment ? openComment() : toQuoted()" in turn,
    ) == (True, True, True), "message replies keep reply treatment while resource comments keep comment treatment"
    assert got["chat"] == [
        '<p>read the room.</p><pre class="chat-code"><code>return [*automatic, *args] if x.get(&quot;auto&quot;, False) else args</code></pre><p>You fix one thing.</p>',
        '<p>Try this:</p><pre class="chat-code"><code>def f(x):\n    return x</code></pre><p>ok?</p>',
        '<pre class="chat-code"><code>const a = 1;\nconst b = a + 2;</code></pre>',
        '<p>I think it is fine, honestly. Nothing to do here.</p>',
    ], "a line of code in a chat message becomes a highlighted block; fences and runs too; prose stays prose"
