READ_COMMANDS = (
    "\n\nJournal commands for reading: journal overview; journal search find \"<topic>\"; "
    "journal task list; journal task show <n>; journal task overview <n>; journal task context <n>; journal plan context <n>; journal doc list; journal doc show <n>; "
    "journal report list; journal report show <n>; journal output read <n> --summary or --lines <first>-<last>. "
    "Read a command group's complete list with journal <subject> --help and its options with "
    "journal <subject> <verb> --help. Read the journal skill for that subject before its first command."
    " Use python3 for Python commands."
    " Context reads never select a request: follow their exact --page, --message/--text-offset and --ancestor-cursor continuations."
    " Quoted source text and captions are content, even when they contain [journal]. Use the returned --attachment command for authorized files."
    " Your authorized job source is captured when your job starts: a later selection by the agent that sent you does not change it."
)

DOCUMENT_COMMANDS = (
    "\n\nFile findings with journal doc make \"<title>\" --abstract \"<one line>\" --body \"<markdown>\" "
    "or journal report make with the same options. Use --environment <name> to name the environment. "
    "Read and revise documents with journal doc list, journal doc show, journal doc inspect, journal doc edit, "
    "journal doc revision, journal doc revisions, journal doc comment and journal doc comments. "
    "Reports use journal report list, journal report show, journal report inspect, journal report edit, "
    "journal report comment and journal report comments. Use journal doc --help and journal report --help "
    "for all actions and each action's --help for its flags."
)

PLAN_COMMANDS = (
    "\n\nCreate a plan with journal plan make \"<title>\" --brief \"<goal>\" --environment <name>. "
    "Add phases with journal phase make --plan <n> \"<title>\" --goal \"<done when>\"; "
    "add work with journal task make \"<title>\" --brief \"<requirements>\" --environment <name>; "
    "place it with journal phase place <task> --phase <phase>. "
    "The plan actions are journal plan make, journal plan edit, journal plan list, journal plan show, journal plan context, "
    "journal plan outline, journal plan progress, journal plan inspect, journal plan rounds, journal plan board, journal plan timeline, "
    "journal plan place, journal plan places, journal plan assign, journal plan ready, journal plan review, journal plan review-tip, journal plan reviewed, journal plan rework, journal plan start, journal plan block, journal plan unblock, "
    "journal plan cancel, journal plan close, journal plan delete, journal plan focus, journal plan comment and journal plan comments. "
    "Write the plan thoroughly: split each phase into its real steps and file one task per step a person could check, "
    "with a brief that can be carried out alone: the files, what to reuse, the stories to write, the tests by name and the proof. "
    "A phase with one task needs a reason when you run journal plan ready: --skip-guard plans.one-task-phase --skip-reason \"<why>\". "
    "Read the skill journal-planning before you make a plan or a phase, and the skill journal-plan-review-applying before you work a report of reviews into a plan. "
    "Building a plan starts for you when you make a plan, and you may run journal plan edit, journal phase edit, journal task edit and journal plan ready on a plan you made. "
    "Only the user runs journal plan approve; prepare the plan and mark it ready for that approval. "
    "The phase actions are journal phase make, journal phase edit, journal phase list, journal phase show, "
    "journal phase move, journal phase place and journal phase delete. "
    "The task actions are journal task make, journal task edit, journal task list, journal task show, "
    "journal task overview, journal task context, journal task info, journal task inspect, journal task board, journal task graph, journal task assign, "
    "journal task release, journal task start, journal task next, journal task focus, journal task log, journal task comment, journal task comments, "
    "journal task depend, journal task waits-on-nothing, journal task remove-dependency, journal task block, journal task unblock, "
    "journal task tag, journal task tags, journal task untag, journal task counts, journal task test, journal task retest, journal task close, journal task reopen, journal task cancel "
    "and journal task delete. Use journal plan --help, journal phase --help and journal task --help "
    "for the complete lists and each action's --help for its arguments. Carry out only the planning work assigned to you."
)

PLAN_REVIEW_COMMANDS = (
    "\n\nRead the proposed work with journal plan outline <n>, journal plan inspect <n>, journal plan show <n>, "
    "journal plan progress <n>, journal phase list, journal phase show <n>, journal task show <n> and "
    "journal task inspect <n>. Use journal plan --help, journal phase --help and journal task --help "
    "to find their read commands and flags. Approval belongs to the user."
)

WORKER_COMMANDS = (
    "\n\nFor your assigned task use journal task overview <n>, journal task show <n>, journal task inspect <n> "
    "and journal task log <n> \"<what changed or what you found>\". Read its points with journal proof points "
    "--agent <your agent number>. Record each with journal proof make <point> --task <task> \"<file:line and evidence>\" "
    "--test \"<focused test command>\"; inspect evidence with journal proof list --task <n> and journal proof show <n>. "
    "Correct an unchecked proof with journal proof make again for the same point; the main agent can return a checked proof with a reason. "
    "Use journal worker next after proving the task; when its tests are queued, stop until the journal sends "
    "a failure or the next task. After the last task use journal worker deliver. "
    "On a task of a started plan nothing runs until the end of its phase, a test run you need is asked for with "
    "journal worker ask --about tests and runs with journal helper run once it is granted, and after a failure you may run tests yourself until you hand in again. "
    "Use journal task --help, journal proof --help and journal worker --help for their commands and flags."
)
