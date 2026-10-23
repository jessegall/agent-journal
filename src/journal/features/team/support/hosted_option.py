from journal.support.option import Option
from journal.support.option_scope import OptionScope

HOSTED = Option("team.hosted", "Hosted for the team's browsers", "This journal runs on the team server for the team's browsers: every person signs in with their team account, and no agent starts here", False, scope=OptionScope.MACHINE)
