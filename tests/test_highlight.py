import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = '''
import {highlight, languageOf} from "./web/src/text/highlight.js";
console.log(JSON.stringify({
    langs: ["a.py", "b.vue", "c.php", "d.cs", "e.md", "f.unknown"].map(languageOf),
    py: highlight("def f(x):\\n    return \\"s\\"  # c\\n", "py"),
    js: highlight("const n = 0x1f; /* a\\nb */ `t`", "js"),
    html: highlight("<div class=\\"x\\">hi</div>", "html"),
    css: highlight("a { color: red; }", "css"),
    escaped: highlight("if a < b:", "py"),
}));
'''


def test_highlight_marks_up_keywords_strings_comments_and_numbers_by_language():
    got = json.loads(subprocess.run(["node", "--input-type=module", "-e", SCRIPT], cwd=ROOT, text=True, capture_output=True, check=True, timeout=60).stdout)
    assert got["langs"] == ["py", "html", "php", "c", "md", "text"], "the language comes from the extension, text when unknown"
    assert got["py"] == \
        ['<span class="tok-keyword">def</span> f(x):', '    <span class="tok-keyword">return</span> <span class="tok-string">&quot;s&quot;</span>  <span class="tok-comment"># c</span>'], \
        "python: keywords, strings and a line comment, one entry per line, the trailing newline dropped"
    assert got["js"] == \
        ['<span class="tok-keyword">const</span> n = <span class="tok-number">0x1f</span>; <span class="tok-comment">/* a</span>', '<span class="tok-comment">b */</span> <span class="tok-string">`t`</span>'], \
        "javascript: hex numbers, a block comment across lines, template strings"
    assert got["html"] == ['<span class="tok-keyword">&lt;div</span> class=<span class="tok-string">&quot;x&quot;</span><span class="tok-keyword">&gt;</span>hi<span class="tok-keyword">&lt;/div</span><span class="tok-keyword">&gt;</span>'], \
        "html: tags and attribute strings"
    assert got["css"] == ['a { <span class="tok-property">color</span>: red; }'], "css: properties"
    assert got["escaped"] == ['<span class="tok-keyword">if</span> a &lt; b:'], "everything is escaped before it is marked up"
