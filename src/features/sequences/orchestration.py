ORCHESTRATION = {
    "title": "Orchestrating a board",
    "brief": "The user started a board, and you orchestrate it: its tickets run one after another in their own environments and "
             "worktrees, each with an agent of its own, and you see every ticket through to its merge. You do not do the tickets' "
             "work yourself. You keep the board moving: you approve their plans, merge what is done, unstick what is stuck, and "
             "report every fault in the journal itself to the agent-journal agent, who fixes it.",
    "starts_on": "board.started",
    "started_by": "",
    "lasting": True,
    "steps": [
        ("Read the board", "Read the board and its cards: journal board show <board n> and journal ticket board <board n>. Note "
                           "the order the tickets must run in, the waits between them, and which are queued, running or done."),
        ("Set the board up", "Ask the user which branch the work lands on if you do not know it, and set it: journal board update "
                             "<board n> --set branch=<branch>. Tickets then branch from it and close once merged into it. Take "
                             "on plan approval: journal board update <board n> --set orchestrator_approves_plans=true."),
        ("Start the tickets", "Move every ticket into the board's start stage, in the order they must run: journal ticket move "
                              "<n> \"<start stage>\". Each agent starts in its own worktree; beyond the running limit, and behind "
                              "the tickets they wait on, they queue and start as slots free."),
        ("Know how you are kept informed", "You need no loop of your own. While this runs, the journal tells you when a ticket's plan "
                                          "waits for you, when a started ticket needs a look (waiting on a prompt, silent, or its agent "
                                          "gone), and, every five minutes you sit idle, to check on the ticket agents. Act on each as it "
                                          "comes; journal ticket board shows the whole board, and journal ticket screen <n> what a ticket agent's terminal says, at any time."),
        ("See every ticket through", "Until every ticket is done: when you are told a ticket's plan waits, review it before you "
                                     "approve anything, the way the board says (plan_reviewer: yourself, or a reviewer subagent "
                                     "you dispatch); the notice names which. Approve only a plan that does the ticket and "
                                     "nothing more: journal ticket approve_plan <n>. Otherwise refuse it: tell its agent what must "
                                     "change and why with journal ticket tell <n> \"<the change>\"; it revises the plan, which waits "
                                     "for you again. When a ticket's work is finished and reviewed, merge it into the "
                                     "board's branch with journal ticket merge <n>, never by hand; it closes and the next one starts. When an agent is stuck on the journal "
                                     "itself, send the agent-journal agent the exact command, its output and the rows involved, "
                                     "wait for the fix, and carry on once it is installed. Move on only when every ticket is closed."),
        ("Report the board done", "When every ticket is closed, write an update for the user: journal report changes, then "
                                  "journal report recap \"<what landed on the board's branch>\"."),
    ],
}
