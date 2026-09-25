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
        ("Keep a check running", "Set a recurring check on the board with your scheduling tool, every 15 minutes: which ticket "
                                 "runs, whether its agent works, waits or is stuck (journal ticket agent_session <n> and its "
                                 "screen), and what is queued. Say in the chat what you set up."),
        ("See every ticket through", "Until every ticket is done: when you are told a ticket's plan waits, review it before you "
                                     "approve anything. Read it against its card (journal --env <ticket env> plan read <plan n>), "
                                     "or dispatch a reviewer subagent to check it. Approve only a plan that does the ticket and "
                                     "nothing more: journal ticket approve_plan <n>. Otherwise refuse it: tell its agent what must "
                                     "change and why with journal ticket tell <n> \"<the change>\"; it revises the plan, which waits "
                                     "for you again. When a ticket's work is finished and reviewed, merge its branch into the "
                                     "board's branch; it closes and the next one starts. When an agent is stuck on the journal "
                                     "itself, send the agent-journal agent the exact command, its output and the rows involved, "
                                     "wait for the fix, and carry on once it is installed. Move on only when every ticket is closed."),
        ("Report the board done", "Stop the recurring check, then write an update for the user: journal report changes, then "
                                  "journal report recap \"<what landed on the board's branch>\"."),
    ],
}
