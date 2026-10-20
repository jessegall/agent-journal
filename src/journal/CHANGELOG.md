# Changelog

What each release of agent-journal version 4 brought, newest first.

## 4.4.1

- The journal runs on Python 3.14. The installer looks for it, records the one it found in .journal/python for every start of the journal, and where none is installed offers to install it with Homebrew or uv. 4.4.0 named a type it never imported, which Python 3.13 and older stop at, so the install failed and put the old journal back.
- An install over a journal numbered 2.x keeps it whole in .journal/version-3, as one numbered 3.x always was.
- The Terminal pane shows the commands the agent runs; the thinking line shows only a thought of the turn in progress.
- An answer to the journal's intro, an MCP sign-in or a worker's limit reaches the chat: those lines were never registered, so their answers were kept out as acknowledgements.

## 4.4.0

- An environment keeps one main agent session for each provider: a session that starts there ends the others of its provider. Installing, signing in to or removing an MCP server restarts only the session on screen, never an older one, whose conversation came back in its place and could end the launch.
- The journal's profiles ship as journal-researcher, journal-planner, journal-debugger, journal-plan-reviewer, journal-senior and journal-medior. At every start and setup every journal skill and journal profile is removed and written fresh; a project's own and a plugin's are never touched. A subagent dispatch names one of the project's profiles, or it is refused: general-purpose and the other generic agents are no profile.
- The session start briefing is the engine's own, said before any Session start workflow, worded and ordered as before.
- Every mark in the chat names the Show in chat switch that hides it, and the menu has a switch for every kind: searches, agent stuck, worktrees, checks, questions, workflow notes, menus, suggestions, phones and the journal's own faults among the new. A fact's or reminder's whisper follows its own switch.
- The plugins' own pages are back in the sidebar, under Project.
- The journal's record is a rolling log of its newest 10,000 entries (the setting record.kept), trimmed as each is written; messages and every other row of the project stay. The database runs with auto-vacuum, switched on once at the first start, so a trimmed record gives its space back.
- Commands that end in the background are named together in one line once the agent is quiet, instead of a line each mid-turn.
- A task closed by a commit names a parked task at once.
- Reads that ask a server outside the journal, the tunnel's cause and answer, are no longer judged against the request budget.
- Closing words of fewer than eight words are never taken for a repeated reply.
- The README says what the journal is and how to install it.

## 4.3.0

- Workflows are built from parts you can see. Whatever a workflow remembers it keeps in values it names and sets with steps on its canvas: counts (Set a count to zero, Start a count at zero once, Add one to a count, Has a count reached N?, Is a count at a multiple of N?) and times (Note the time, Forget a noted time, Has N passed since a noted time?, Was a time noted?). Each environment keeps its own, and a workflow never reads another's.
- Every shipped workflow is drawn from these parts, telling the agent what it did before: the quiet clocks note their time on the move that starts the wait and on the agent's own events, and the cadences count their own tool uses, writes and lines. No check keeps a clock or works out a count out of sight any more.
- The ask about a task blocked on something outside speaks after 45 minutes of quiet; at an hour it never spoke, since an hour of quiet ends the session first.
- While the agent waits, the next task is named once for the wait, not after every turn.
- A workflow holds a trigger for each event it needs, with its own place in each event's run order, and is listed under each of them, marked with the others. New triggers: Await, Command moved to the background, Background command ended, Commit made and Journal line said. New checks: a task just taken in hand, parked or blocked, the agent's reply, a message typed in the terminal, an open question, a plan followed, a tool held already, and how many commands run in the background.
- The workflows page shows each environment's values, picked in its bar, with when each was set and by which step; the run order changes in a mode of its own, with a ghost where the workflow will land; a run names the event that started it.
- The upgrade, for your own workflows: one that names Has the agent been quiet for N?, Is the log older than N? or Has a command run in the background longer than N?, or a count the journal used to read from its record (edits, uses, owed, namings, lines), is turned off at the upgrade, its title saying which, for you to draw again from counts and times; a shipped workflow you edited is treated the same. A clock running in a session goes on across the upgrade; a cadence starts its count afresh.
- Suggestions: a while after the journal starts (15 minutes) and then hourly (both settings under Suggestions), the journal looks for something worth suggesting and shows each as a card in the chat, answered once and never suggested again. The first: Code Commandments installed in the project as a package, with hooks of its own, is suggested as the journal's plugin at its latest release; accepting opens the Plugins page with its install ready to check.
- A line naming a list or a count that changes is held by its kind inside its window: the commands still running, the workers' reports waiting, the awaited check and the blocked task no longer come again each time their list or minutes change, and the blocked ask comes at most every 45 minutes instead of on every tick.
- A message is answered once. A second reply from the agent to a message it already answered, by command or by a typed reply tag, is refused once and named back, and goes out with --confirm; closing words that say again what a reply sent in the same turn said stay out of the chat, and the agent is told.
- Memory and storage: a thread that ends without releasing its database connection gives it back; a plugin's hearing after the reply is skipped once the journal's deferred work is 500 pieces behind, and the server's log says so; a tool's response is stored cut to 4000 characters a text; a live transcript in the viewer holds its newest thousand turns.
- A slow request that named no environment is marked in the live agent's environment instead of failing in its report.
- Skills read at once each stay paid: four read together no longer leave three owed.
- journal chart try takes --since name=seconds; journal chart show prints each environment's values; journal doc update writes a document anew from a file.

## 4.2.5

- A message always reaches an idle agent. The agent a supervisor runs is no longer taken for gone after an hour without a hook, which had left it ended and every message after that untyped; only a session no supervisor runs, a terminal closed without its end hook, is still ended after an hour.

## 4.2.4

- The most subagents at once counts only those already running: the one being started is no longer counted among them, so four running and a fifth pass a most of five.

## 4.2.3

- A question's options are each their own quoted argument, `--options "first" "second"`, so a comma inside a choice stays in it; one option holding a comma is refused as the old comma list, and the options asked are printed back numbered.
- A plan's next task is named once: closing another of its tasks beside the one in hand no longer names it again.
- The Code page's file tree shows the project again; since 4.2.0 its root listed nothing.

## 4.2.2

- A link is suggested as a pin only from what a shell command printed; a file edit or read no longer suggests every link in the file.
- Two skill files read at once both count as read; one of the pair was sometimes lost, so a stop was held for a skill already read.
- Pausing the agent is no longer a setting: the pause button is always there.
- Slow requests are reported, and shown on the settings page, only in the journal's own checkout.

## 4.2.1

- A message opened in the side panel is titled by its first line, cut after a whole word at 80 characters, with the whole text below it.

## 4.2.0

- The phone is back. Click the phone in the top bar, scan the code or type the short code on the phone, and the journal opens on it through the tunnel, installable as an app. The phone is the viewer itself, sized for a finger: the chat, Home, tasks, plans, questions and every row, without the pages that configure the journal.
- A paired phone is known by a key in a cookie its pages cannot read, lasting the 1, 7 or 30 days chosen; a code pairs once, runs out after ten minutes and is voided by ten wrong tries; one phone at a time, disconnected from the computer or from itself.
- A phone acts as itself and its words are yours. It reads everything but secrets and changes only what the app does: talking to the agent, answering, approving and following plans, tasks, comments and dumps, pausing the agent. Settings, plugins, MCP servers, secrets, the tunnel and workflows stay on the computer.
- The phone is told by a push when a question or a plan waits for you; the lock screen says only how many things wait.
- A phone paired under version 3 is told it was paired with an earlier version and pairs once more.
- A question is answered once: a second answer, from the computer or the phone, is refused.

## 4.1.9

- An agent that works again is no longer waiting: a tool use of its own ends a wait on a question or on a worker, as it already ended a wait on something outside, so the status bar never stays on Waiting while the agent works.
- A command that only reads the project's own code runs as written, pipes and all, and answers at once; other commands still lose a trailing | tail, since their whole output is kept.
- journal output read needs a flag naming the part (--tail, --head, --grep, --lines, --reader), --summary for how it ended or --all for every line; the line that names a kept output teaches the flags on the first of every 25 and is short the rest of the time.

## 4.1.8

- Resetting a shipped workflow puts it back at its shipped place in the run order too, an Always one included; a shipped workflow's place comes from the shipped table alone, so drawing it and resetting it agree.

## 4.1.7

- Every shipped workflow checks what it acts on itself: the checkpoint wait checks auto mode is off, the carry-on and the log ask check a task is in hand, and none counts on an earlier one stopping the walk.
- Run no later workflows is now Stop the later workflows, and the note about it says plainly what does not run.
- The state of an agent waiting on something it named with journal await is called Waiting.

## 4.1.6

- The MCP page shows every server as the last check found it as soon as it opens: the first look starts the check, with skeleton rows until it lands, and the check is kept for an hour; adding or removing a server checks again, and Check all is now Refresh.

## 4.1.5

- The Resources page groups its pages under This environment and Whole project, as their rows are kept.
- The documents list's date heading sticks flush under the search bar, so no row shows above it.
- A run of the viewer's tests marks itself, so the journal does not report requests as slow while it runs.

## 4.1.4

- A setting's help says only what it does, in plain words; a workflow that uses the setting shows under it as a link that opens that workflow.

## 4.1.3

- The sharing dialog opens at once: tunler's version and domains are kept for an hour instead of asked on every look, and a tunler command that only reads no longer asks tunler's status again; a login, an update or a release asks again at once.

## 4.1.2

- The settings page shows a model setting as a model picker, not an empty bar, and a setting's help names the workflow that reads it, never a node's number or a claim that nothing reads it.

## 4.1.1

- A plan in review shows its reviewers still out as they come back: the plan keeps the count itself, so the chat card and the plan page no longer say a reviewer is reading after it has reported.

## 4.1.0

Worktrees work as they did in version 3.

- `journal claude -w NAME` makes or reuses `.claude/worktrees/NAME` on the branch `worktree-NAME`, with the project's journal, skills and hooks linked in where git does not see them, and runs the agent there in the environment NAME; a bare `-w` takes the chosen environment's name. Claude Code never sees the flag, so it never removes the worktree.
- A worktree's last commit is kept under `refs/journal/worktrees/NAME`, so a worktree whose folder or branch went is made again from it.
- A hook or a `journal` command run inside a worktree works its environment; a conversation resumed runs where it last ran; the launcher's menu and the viewer's sidebar name a worktree's branch.
- A worker's worktree is cut from the working tip, or the dispatch is refused in plain words. Its merge never touches your uncommitted work, rebases a branch behind the tip and names conflicts. The agent is kept out of a worker's worktree, and a worker's report names the files it changed.
- A done worker's worktree goes with its branch once nothing in it is uncommitted; deleting an environment takes its worktree only when its work is merged. A folder no worktree owns is moved aside, never deleted.
- A session in a worktree is marked with its branch in the chat, and a commit made there closes the task its trailer names when a merge lands it.
- A session start opens the viewer when no tab has it open, and says in the launch log what it did.
- A reminder whispered to the agent shows its words in the chat and opens its row.
- The About page shows this changelog, page by page, with the Update button.
- A launch from the terminal offers a newer release of the same major version on the boot screen before the journal starts: update now, or start as it is.
- An install that would go back to an earlier version says the record was written by the newer one, whose models the earlier one may not read, advises staying, and asks first.

## 4.0.5

- Every menu in an agent's terminal is answered as version 3 did: one with the cursor on an option is seen though the prompt box is drawn below it; a yes-or-no confirmation of what you just asked at the keyboard is confirmed; one the word rules cannot settle is answered from memory or by an independent Claude Code or Codex run once outside the project, and its pick is kept.

## 4.0.4

- A message from another session shows as that session's, by name, never as yours.
- Claude Code's cross-session notices, and any piece of a line the journal typed, are never taken for your words.
- The five-minute check on a command in the background names only the output's number.

## 4.0.3

- `journal claude -w` is the journal's own: the worktree is made, kept and shared with the project's journal and hooks.
- A worker's worktree is cut from the working tip, and its merge never touches your uncommitted work.
- Setup takes out version 3's hooks, which otherwise failed on every tool call.
- A command mark in the chat is one line, cut short.
- The journal's lines ask the agent to answer or react to a message, in a few words.

## 4.0.2

- A second reply with the same words to the same message is not sent again, and the agent is told so.

## 4.0.1

- `journal claude --worktree NAME` no longer hands the flag to Claude Code, which removed the worktree when it exited.

## 4.0.0

Version 4: the same journal, rebuilt simple. The supervisor is a thin process host that restarts every service and survives any fault in its own loop; workflows on a canvas carry the journal's conduct toward the agent; a version 3 journal is kept whole in `.journal/version-3` and brought across from the viewer.
