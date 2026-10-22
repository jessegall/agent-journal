from journal.support.option import Option

FOREGROUND_OPTION = Option("shell.foreground", "Run a command in the foreground for", "Seconds a part of a command may run before the rest of the chain moves to the background, and a line for a working agent waits for its next tool use before it is typed", 30, unit="seconds")
