import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tests.kit import check, done

root = Path(__file__).resolve().parents[1]
script = '''
import "./web/src/text/all.js";
import {markdown} from "./web/src/text/markdown.js";
import {render} from "./web/src/text/index.js";
const ctx = {types: [{name: "todo", title: "To-do"}], env: "main"};
console.log(JSON.stringify({
    blocks: markdown("# Title\\n\\nA *word* and **bold** with `x < y`.\\n\\n- one\\n- two\\n\\n1. first\\n2. second\\n\\n```\\nraw <b>\\n```\\n\\n> quoted", ctx),
    table: markdown("| a | b |\\n|---|---|\\n| 1 | to-do 75 |", ctx),
    plain: markdown("just text\\nnext line", ctx),
    chat: [
        render("read the room.\\n\\nreturn [*automatic, *args] if x.get(\\"auto\\", False) else args\\n\\nYou fix one thing.", ctx),
        render("Try this:\\n```py\\ndef f(x):\\n    return x\\n```\\nok?", ctx),
        render("const a = 1;\\nconst b = a + 2;", ctx),
        render("I think it is fine, honestly. Nothing to do here.", ctx),
    ].map((h) => h.replace(/<span class="tok-\\w+">|<\\/span>/g, "")),
}));
'''
got = json.loads(subprocess.run(["node", "--input-type=module", "-e", script], cwd=root, text=True, capture_output=True, check=True).stdout)
check("headings, emphasis, code spans, lists, fences and quotes", got["blocks"],
      "<h3>Title</h3><p>A <em>word</em> and <strong>bold</strong> with <code>x &lt; y</code>.</p><ul><li>one</li><li>two</li></ul><ol><li>first</li><li>second</li></ol><pre><code>raw &lt;b&gt;</code></pre><blockquote><p>quoted</p></blockquote>")
check("a table, with the record's refs still turned into pills inside cells", got["table"],
      '<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>1</td><td><a class="row-pill" href="#" data-peek="todo:75">to-do 75</a></td></tr></tbody></table>')
check("plain lines are one paragraph with breaks", got["plain"], "<p>just text<br>next line</p>")
check("a line of code in a chat message becomes a highlighted block; fences and runs too; prose stays prose", got["chat"], [
    '<p>read the room.</p><pre class="chat-code"><code>return [*automatic, *args] if x.get(&quot;auto&quot;, False) else args</code></pre><p>You fix one thing.</p>',
    '<p>Try this:</p><pre class="chat-code"><code>def f(x):\n    return x</code></pre><p>ok?</p>',
    '<pre class="chat-code"><code>const a = 1;\nconst b = a + 2;</code></pre>',
    '<p>I think it is fine, honestly. Nothing to do here.</p>',
])
done()
