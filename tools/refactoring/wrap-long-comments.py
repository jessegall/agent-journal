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


def php_files(roots):
    """Every .php file under the roots."""
    for root in roots:
        for folder, _, names in os.walk(root):
            yield from (os.path.join(folder, name) for name in names if name.endswith('.php'))


def is_long_comment(line):
    """Whether the line is a comment past the limit that is not a docblock's closing line."""
    return len(line) > LIMIT and COMMENT.match(line) and not line.lstrip().startswith('*/')


def wrapped_lines(source):
    """The file's lines with every long comment wrapped, and how many comment lines were wrapped."""
    output = []
    count = 0
    for line in source:
        pieces = wrap(line) if is_long_comment(line) else [line]
        output += pieces if len(pieces) > 1 else [line]
        count += len(pieces) > 1
    return output, count


changed_files = 0
wrapped = 0
for path in php_files(sys.argv[1:]):
    source = open(path).read().split('\n')
    output, count = wrapped_lines(source)
    if count:
        open(path, 'w').write('\n'.join(output))
        changed_files += 1
        wrapped += count
print(f'Wrapped {wrapped} comment lines in {changed_files} files.')
