"""Wraps PHP comment lines wider than 120 characters at word boundaries, keeping their prefix.

A docblock line keeps its ` * ` prefix. Tag lines (@param, @return, @phpstan-*) are left whole, since their types
must stay on one line for static analysis. A `//` comment keeps
its `// ` prefix. Code lines are never touched.

Usage: python3 tools/refactoring/wrap-long-comments.py <folder>...
"""
import os
import re
import sys
import textwrap

LIMIT = 120
COMMENT = re.compile(r'^(\s*(?:\*|//)\s?)(.*)$')


def wrap(line):
    match = COMMENT.match(line)
    if match is None or line.lstrip().startswith('*/'):
        return [line]
    prefix, text = match.group(1), match.group(2)
    if text.startswith('@') or text.startswith('```'):
        continuation = prefix + '  ' if text.startswith('@') else prefix
    else:
        continuation = prefix
    if text.startswith('```') or text.startswith('|') or text.startswith('@'):
        return [line]
    width = LIMIT - len(prefix)
    first, *rest = textwrap.wrap(text, width=width, break_long_words=False, break_on_hyphens=False) or ['']
    lines = [prefix + first]
    remaining = ' '.join(rest)
    if remaining:
        lines += [continuation + part for part in textwrap.wrap(
            remaining, width=LIMIT - len(continuation), break_long_words=False, break_on_hyphens=False)]
    return lines


changed_files = 0
wrapped = 0
for root in sys.argv[1:]:
    for folder, _, names in os.walk(root):
        for name in names:
            if not name.endswith('.php'):
                continue
            path = os.path.join(folder, name)
            source = open(path).read().split('\n')
            output = []
            touched = False
            for line in source:
                if len(line) > LIMIT and COMMENT.match(line) and not line.lstrip().startswith('*/'):
                    pieces = wrap(line)
                    if len(pieces) > 1:
                        output += pieces
                        touched = True
                        wrapped += 1
                        continue
                output.append(line)
            if touched:
                open(path, 'w').write('\n'.join(output))
                changed_files += 1
print(f'Wrapped {wrapped} comment lines in {changed_files} files.')
