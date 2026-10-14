"""How a command tag is written at the start of a line of a turn: its name, the messages or the name it carries, and its named arguments."""

import re

VALUE = r'(?:"[^"]*"|\([^)]*\)|[^,\]\s]+)'
EXTRA = r'(?:\s*,\s*|\s+)[a-z_]+=' + VALUE
ARGUMENT = r'(?::[0-9]+(?:,[0-9]+)*|="[^"]*")?(?:' + EXTRA + r')*'
CARRIED = re.compile(r'^[ \t]*(?:>\s?)?(?:\*\*)?\[!([a-z]+)(?::([0-9]+(?:,[0-9]+)*)|="([^"]*)")?((?:' + EXTRA + r')*)\]', re.M)
NAMED = re.compile(r'([a-z_]+)=(' + VALUE + r')')
