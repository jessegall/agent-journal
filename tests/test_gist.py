import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tests.kit import check, done

root = Path(__file__).resolve().parents[1]
script = '''
import {gists, gistTokens} from "./web/src/gist.js";
import {spoken} from "./web/src/spoken.js";
console.log(JSON.stringify({
    patch: gists("*** Begin Patch\\n*** Update File: x\\n+check('leak')\\n*** End Patch"),
    shell: gists("git commit -m done && rg needle src"),
    loop: gists(`for f in tests/test_*.py tests/features/*/test_*.py; do echo "$f"; perl -e 'alarm 60; exec @ARGV' python3 "$f" || exit 1; done`),
    tokens: gistTokens("git commit file.txt").map((token) => token.kind),
    slash: gists("ls ~/projects/ 2>/dev/null | head"),
    paths: spoken(["message", "paths", "104"], [{name: "message", title: "Message", names: {}}]),
    tag: spoken(["message", "tag", "105", "x.png", "words"], [{name: "message", title: "Message", names: {}}]),
}));
'''
result = subprocess.run(["node", "--input-type=module", "-e", script], cwd=root, text=True, capture_output=True, check=True)
got = json.loads(result.stdout)
check("patch bodies are not command gists", got["patch"], [])
check("real chained shell commands still split", got["shell"], ["git commit done", "rg needle"])
check("shell loops keep the inner executable", got["loop"], ["python3 script"])
check("a subcommand shares the executable's emphasis", got["tokens"], ["command", "command", "argument"])
check("a path ending in a slash still names its last part", got["slash"], ["ls projects"])
check("an unknown word ending in s is a thing of the row, not a verb to conjugate", (got["paths"], got["tag"]), ("the paths of message 104", "tagging message 105"))
done()
