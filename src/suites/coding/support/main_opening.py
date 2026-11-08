from suites.coding.support.main_options import MainOptions

CODE_ALLOWED = "Eligible work is handed to you: write it yourself, or hand it to a worker."
CODE_FORBIDDEN = "You write no project file; send each piece of work to a worker. Documents, plans and journal records stay allowed."
SENDS_WORKERS = "You may send workers."
WORKERS_DISABLED_LINE = "You send no workers."
KEEP_GOING_LINE = "Keep going while work can be sent to a worker."
HELPERS = "You may start read-only helpers."
DESIGNER = "You may start a designer, which changes no code."
MERGES = "You may merge a worker yourself."
MERGER = "The merger takes in workers whose tests passed."
SETTINGS_LINE = "Read the exact limits with journal setting show."


class MainOpening:
    """The opening lines of the main agent, written from what it may do in its environment and nothing else."""

    def __init__(self, options: MainOptions) -> None:
        self.options = options

    def lines(self) -> tuple[str, ...]:
        options = self.options
        lines = [CODE_ALLOWED if options.auto else CODE_FORBIDDEN,
                  SENDS_WORKERS if options.sends_workers else WORKERS_DISABLED_LINE,
                  KEEP_GOING_LINE if options.keeps_going else "",
                  HELPERS if options.helpers else "",
                  DESIGNER if options.designer else "",
                  MERGES if options.may_merge else "",
                  MERGER if options.merger else "",
                  SETTINGS_LINE]
        return tuple(line for line in lines if line)
