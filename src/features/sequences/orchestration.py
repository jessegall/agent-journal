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
                             "on what the user lets you decide while your auto mode is on: journal board update <board n> --set "
                             "orchestrator_approves_plans=true --set orchestrator_accepts_waits=true --set orchestrator_confirms_drafts=true."),
        ("Start the tickets", "Move every ticket into the board's start stage, in the order they must run: journal ticket move "
                              "<n> \"<start stage>\". Each agent starts in its own worktree; beyond the running limit, and behind "
                              "the tickets they wait on, they queue and start as slots free."),
        ("Know how you are kept informed", "You need no loop of your own. While this runs, the journal tells you when a ticket's plan "
                                          "waits for you, when a started ticket needs a look (waiting on a prompt, silent, or its agent "
                                          "gone), and, every five minutes you sit idle, to check on the ticket agents. Act on each as it "
                                          "comes; journal ticket board shows the whole board, and journal ticket screen <n> what a ticket agent's terminal says, at any time."),
        ("See every ticket through", "Until every ticket is closed, each moment of a ticket is handed to you as a short sequence of its own, "
                                     "ahead of this one: a plan to review, a checkpoint to pass, finished work to merge, an agent that is "
                                     "stuck. Follow each to its end; this step waits until every ticket on the board is closed. You may "
                                     "stop and start a ticket's agent yourself; tell the agent-journal agent only what a restart does not fix."),
        ("Report the board done", "When every ticket is closed, write an update for the user: journal report changes, then "
                                  "journal report recap \"<what landed on the board's branch>\"."),
    ],
}


FIND_IT = "journal ticket show <ticket n> names its environment and its plan."

REVIEWING_A_PLAN = {
    "title": "Reviewing a ticket's plan",
    "brief": "A ticket's plan waits for your approval. Review it against the ticket before you approve anything.",
    "starts_on": "ticket.plan_waits",
    "started_by": "",
    "steps": [
        ("Read the ticket and its plan", f"{FIND_IT} Read the ticket's card and the plan with journal --env <its environment> plan read "
                                         "<its plan>. If the board's plan_reviewer is a subagent, dispatch a reviewer subagent to do this "
                                         "and the next step."),
        ("Check it does the ticket and nothing more", "Every phase and to-do serves the ticket's card, none does work the card does not ask "
                                                      "for, and it ends with the card's done-when true."),
        ("Approve it or send it back", "Approve it with journal ticket approve_plan <ticket n>, or tell its agent what must change and why "
                                       "with journal ticket tell <ticket n> \"<the change>\"; the revised plan comes back as a new review."),
    ],
}

PASSING_A_CHECKPOINT = {
    "title": "Passing a checkpoint",
    "brief": "A ticket's plan stopped at a checkpoint. Check the phase before it, then let it go on, so the board never waits overnight.",
    "starts_on": "ticket.checkpoint",
    "started_by": "",
    "steps": [
        ("Check the phase before it", f"{FIND_IT} Read where it stands with journal --env <its environment> plan progress <its plan>, and "
                                      "check the phase before the checkpoint did what it says."),
        ("Let it go on", "Continue it with journal ticket continue_plan <ticket n>, or tell its agent what to fix first with journal ticket "
                         "tell <ticket n> \"<what>\"."),
    ],
}

MERGING_A_TICKET = {
    "title": "Merging a ticket",
    "brief": "A ticket finished its plan with a clean worktree. Check its work before it lands on the board's branch.",
    "starts_on": "ticket.finished",
    "started_by": "",
    "steps": [
        ("Run the tests on its branch", f"{FIND_IT} Run the project's tests in the ticket's worktree. When they fail, tell its agent what "
                                        "failed with journal ticket tell <ticket n> \"<what failed>\" and abandon this run: it comes back "
                                        "when the ticket finishes again."),
        ("Have its work reviewed", "Dispatch a reviewer subagent to read the branch's diff against the ticket's card: does it do the card, "
                                   "and only the card? Send back what it finds the same way."),
        ("Merge it", "Merge it into the board's branch with journal ticket merge <ticket n>, never by hand; the ticket closes and the next "
                     "one starts."),
    ],
}

UNSTICKING_A_TICKET_AGENT = {
    "title": "Unsticking a ticket agent",
    "brief": "A ticket's agent is waiting on a prompt, silent, or gone. Get it working again.",
    "starts_on": "ticket.stuck",
    "started_by": "",
    "steps": [
        ("Look at its screen", "journal ticket screen <ticket n> shows what its terminal says."),
        ("Get it going", "Answer what it waits on with journal ticket tell <ticket n> \"<what to do>\", or restart it with journal ticket "
                         "stop <ticket n> then journal ticket start <ticket n>."),
        ("Report what a restart does not fix", "If it is stuck again after a restart, the fault is in the journal: send the agent-journal "
                                               "agent the exact command, its output and the ticket, then carry on with the other tickets."),
    ],
}

ORCHESTRATING_MOMENTS = (REVIEWING_A_PLAN, PASSING_A_CHECKPOINT, MERGING_A_TICKET, UNSTICKING_A_TICKET_AGENT)
