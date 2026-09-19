import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tests.kit import check, done

root = Path(__file__).resolve().parents[1]
script = '''
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
got = json.loads(subprocess.run(["node", "--input-type=module", "-e", script], cwd=root, text=True, capture_output=True, check=True).stdout)
check("the language comes from the extension, text when unknown", got["langs"], ["py", "html", "php", "c", "md", "text"])
check("python: keywords, strings and a line comment, one entry per line, the trailing newline dropped", got["py"],
      ['<span class="tok-keyword">def</span> f(x):', '    <span class="tok-keyword">return</span> <span class="tok-string">&quot;s&quot;</span>  <span class="tok-comment"># c</span>'])
check("javascript: hex numbers, a block comment across lines, template strings",
      got["js"], ['<span class="tok-keyword">const</span> n = <span class="tok-number">0x1f</span>; <span class="tok-comment">/* a</span>', '<span class="tok-comment">b */</span> <span class="tok-string">`t`</span>'])
check("html: tags and attribute strings", got["html"], ['<span class="tok-keyword">&lt;div</span> class=<span class="tok-string">&quot;x&quot;</span><span class="tok-keyword">&gt;</span>hi<span class="tok-keyword">&lt;/div</span><span class="tok-keyword">&gt;</span>'])
check("css: properties", got["css"], ['a { <span class="tok-property">color</span>: red; }'])
check("everything is escaped before it is marked up", got["escaped"], ['<span class="tok-keyword">if</span> a &lt; b:'])
done()
