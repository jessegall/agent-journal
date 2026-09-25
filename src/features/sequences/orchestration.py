ORCHESTRATION = {
    "title": "Orchestrating a board",
    "brief": "The user pressed Play, and you run the board: its tickets run in order, each with an agent of its own in its own "
             "worktree, and you see every ticket through to its merge. You do not do the tickets' work yourself, and you stay free "
             "for anything else the user asks. Each moment of a ticket comes to you as a short sequence of its own, ahead of this one.",
    "starts_on": "board.started",
    "started_by": "",
    "lasting": True,
    "steps": [
        ("Tell the user", "Say once, in one short message, what Play does: journal message create \"I'm running <board> now: <k> "
                          "tickets, each with its own agent in its own worktree, merged into <branch> in order. I review their plans "
                          "and merge their work, and I'll only ask you what I can't decide. You can keep asking me for anything "
                          "else.\" (journal board show <board n> gives the board, its branch and its goal)."),
        ("Read the board", "Read the board and its cards: journal board show <board n> and journal ticket board <board n>. Note the "
                           "order the tickets must run in, the waits between them, and which are queued, running or done."),
        ("Take on the decisions", "Take on what the user lets you decide while your auto mode is on: journal board update <board n> "
                                  "--set orchestrator_approves_plans=true --set orchestrator_accepts_waits=true --set "
                                  "orchestrator_confirms_drafts=true. Accept the waits between the cards (journal ticket "
                                  "accept_dependencies <n>); when auto mode is off, ask the user to confirm them first with journal "
                                  "board ask. Say in one line which decisions stay with the user."),
        ("Start the tickets", "Move every ticket into the board's start stage, in the order they must run: journal ticket move "
                              "<n> \"<start stage>\". Each agent starts in its own worktree; beyond the running limit, and behind "
                              "the tickets they wait on, they queue and start as slots free."),
        ("Hand off", "From here this sequence only waits: each moment of a ticket (a plan to review, a checkpoint, finished work, a "
                     "conflict, a ticket sent back twice, a stuck agent) and the board being paused or finished comes as a short "
                     "sequence of its own. When two arrive together, merges go first, since a merge frees a slot. Never start the "
                     "user's own work inside a ticket's sequence. Move on with journal sequence next <this sequence> --about <ref> "
                     "once the board is finished and closed."),
    ],
}


FIND_IT = "journal ticket show <ticket n> names its environment, its plan and the board it is on."

REVIEWING_A_PLAN = {
    "title": "Reviewing a ticket's plan",
    "brief": "A ticket's plan waits for your approval. Review it against the ticket before you approve anything.",
    "starts_on": "ticket.plan_waits",
    "started_by": "",
    "steps": [
        ("Read the ticket and its plan", f"{FIND_IT} Read the ticket's card and the plan with journal --env <its environment> plan read "
                                         "<its plan>. If the board's plan_reviewer is a subagent, dispatch the plan-reviewer agent "
                                         "type for this and the next step."),
        ("Check it does the ticket and nothing more", "Every phase and to-do serves the ticket's card, none does work the card does not ask "
                                                      "for, and it ends with the card's done-when true."),
        ("Approve it or send it back", "Approve it with journal ticket approve_plan <ticket n>, or send it back with what must change and "
                                       "why: journal ticket send_back <ticket n> \"<the change>\". A ticket sent back twice is escalated to "
                                       "the user by itself."),
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
        ("Let it go on", "Continue it with journal ticket continue_plan <ticket n>, or send it back with what to fix first: journal "
                         "ticket send_back <ticket n> \"<what>\"."),
    ],
}

MERGING_A_TICKET = {
    "title": "Merging a ticket",
    "brief": "A ticket finished its plan with a clean worktree. Check its work before it lands on the board's branch.",
    "starts_on": "ticket.finished",
    "started_by": "",
    "steps": [
        ("Review its work", f"{FIND_IT} Dispatch the ticket-reviewer agent type: it runs the ticket's tests in its worktree and checks "
                            "the diff against every done-when clause of its card, and answers pass or fail with evidence. On a fail, "
                            "send it back with what failed (journal ticket send_back <ticket n> \"<what failed>\") and abandon this run: "
                            "it comes back when the ticket finishes again."),
        ("Merge it", "Merge it into the board's branch with journal ticket merge <ticket n>, never by hand; the ticket closes and the "
                     "next one starts. When the merge is refused because the branches conflict, start Resolving a merge conflict: "
                     "journal sequence run <that sequence> --about ticket:<ticket n>."),
    ],
}

RESOLVING_A_CONFLICT = {
    "title": "Resolving a merge conflict",
    "brief": "A ticket's merge was refused because its branch conflicts with the board's branch. Hand it back with exactly what to do.",
    "starts_on": "",
    "started_by": "",
    "steps": [
        ("Name the conflict", f"{FIND_IT} In its worktree, try the merge without committing (git merge --no-commit --no-ff <board branch>, "
                              "then git merge --abort) to name the conflicting files, and read which merged ticket changed them."),
        ("Hand it to its agent", "Tell its agent: journal ticket tell <ticket n> \"Rebase onto <board branch>; conflicts in <files>; keep "
                                 "<merged ticket>'s change to <what>.\" Its next finish starts a fresh merge."),
    ],
}

ESCALATING_A_TICKET = {
    "title": "Escalating a ticket",
    "brief": "A ticket was sent back twice. Stop it and let the user decide; the rest of the board runs on.",
    "starts_on": "ticket.escalated",
    "started_by": "",
    "steps": [
        ("Stop it", f"{FIND_IT} Stop its agent: journal ticket stop <ticket n>. Tickets that wait on it stay queued."),
        ("Ask the user", "Ask on the board with both reasons it was sent back: journal board ask <board n> \"<ticket> was sent back "
                         "twice: <reasons>\" --set options='[{\"title\": \"Let me look\"}, {\"title\": \"Rewrite the card\"}, {\"title\": "
                         "\"Drop it\"}]'."),
        ("Act on the answer", "Let me look: leave it stopped and say so in the chat. Rewrite the card: dispatch the board-filler to revise "
                              "it, then journal ticket start <ticket n>. Drop it: journal ticket delete <ticket n> --why \"<their words>\"."),
    ],
}

UNSTICKING_A_TICKET_AGENT = {
    "title": "Unsticking a ticket agent",
    "brief": "A ticket's agent is waiting on a prompt, silent, idle with nothing running, or gone. Get it working again.",
    "starts_on": "ticket.stuck",
    "started_by": "",
    "steps": [
        ("Look at its screen", "journal ticket screen <ticket n> shows what its terminal says."),
        ("Get it going", "Answer what it waits on with journal ticket tell <ticket n> \"<what to do>\", or restart it with journal ticket "
                         "stop <ticket n> then journal ticket start <ticket n>."),
        ("Report what a restart does not fix", "If this ticket was stuck before in the last 15 minutes, the fault is in the journal: send "
                                               "the agent-journal agent the exact command, its output and the ticket, then escalate it: "
                                               "journal sequence run <Escalating a ticket> --about ticket:<ticket n>."),
    ],
}

PAUSING_A_BOARD = {
    "title": "Pausing a board",
    "brief": "The user paused the board. Stop its running tickets and keep their worktrees until they resume it.",
    "starts_on": "board.paused",
    "started_by": "",
    "steps": [
        ("Halt the tickets", "Stop every running ticket of the board: journal ticket stop <n> for each (journal ticket board <board n> "
                             "shows which run). Their worktrees stay. Say it in the panel: journal board say <board n> \"Paused; "
                             "<k> tickets keep their worktrees.\""),
    ],
}

RESUMING_A_BOARD = {
    "title": "Resuming a board",
    "brief": "The user resumed the board. Start the tickets that were halted, in their order.",
    "starts_on": "board.resumed",
    "started_by": "",
    "steps": [
        ("Start the halted tickets", "Start every ticket of the board that was stopped by the pause, in the order they must run: journal "
                                     "ticket start <n>."),
    ],
}

CLOSING_A_BOARD = {
    "title": "Closing a board",
    "brief": "The last ticket of a running board closed. Check the goal clause by clause and tell the user.",
    "starts_on": "board.finished",
    "started_by": "",
    "steps": [
        ("Check the goal", "Dispatch the goal-verifier agent type for the board: it runs the full tests on the board's branch and checks "
                           "every done-when clause of the board's goal for real, answering met or not met with evidence. A clause that "
                           "no card the user kept covers is left out by choice, not failed."),
        ("Close the gap", "If a clause is not met, dispatch the board-filler to draft only the missing cards (journal board expect "
                          "<board n> <count> --fewer \"only what is missing\"), and tell the user what is missing in one line; "
                          "pressing Play again runs them. Otherwise go on."),
        ("Report", "Write the update: journal report changes, then journal report recap \"<goal>: reached (or what is left). "
                   "<each clause met or not>. Landed on <branch>: <one line per ticket>. Sent back: <count>. Escalated: <list>.\""),
    ],
}

ORCHESTRATING_MOMENTS = (REVIEWING_A_PLAN, PASSING_A_CHECKPOINT, MERGING_A_TICKET, RESOLVING_A_CONFLICT, ESCALATING_A_TICKET,
                         UNSTICKING_A_TICKET_AGENT, PAUSING_A_BOARD, RESUMING_A_BOARD, CLOSING_A_BOARD)
