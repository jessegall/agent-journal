# Changelog

What each release of agent-journal version 4 brought, newest first.

## Unreleased, on the development branch

- The workflows are gone: the journal's conduct toward the agent is its states, a stack on the agent's row with the features' conduct folded into every state, and the Workflows page, the `journal chart` command, the journal-chart skill and the chart's tables go with them. A workflow the user made or edited is kept as a document named after it, 'Workflow: <title>', with its nodes and lines in words, written by the upgrade before the tables drop. docs/the-rules.md is now the table of every state and every line and who says it.
- A hook times itself end to end: the hook script stamps its start, the server measures to its answer, keeps the time on the hook's entry, shows it on the activity list and reports a hook over its budget like a slow request.
- The runner's line after a long command says only 'output N kept' with its size, and after a cut 'the whole output is kept as output N'; it no longer teaches the read command every time.
- A command's trailing head or tail is taken off the line, the command runs whole and the whole output is kept under its number, and the cut is applied to it before the agent sees it, with a line naming the kept number; before, the agent was shown only the number in place of the lines it asked for.
- A command whose whole output is under 200 characters, with no pipe in its line, prints as it is and keeps no numbered output and names no number; a longer output, or a line with a pipe into head, tail, grep or any filter, is kept as before. The limit is the setting Keep no output under.
- The journal can follow a branch: Settings, Updates, Follow this branch names it (and Install from this repository the repository), and Install update, `journal update` and the hourly check then install that branch's newest commit instead of a release. The installer records the commit it installed in `.journal/src/commit`, and the About page says which branch the journal follows. `journal update follow <branch>` sets the branch from the terminal, `journal update unfollow` follows the releases again.
- On a followed branch the update band and the About page name the installed commit, 'development at b58f86a', and the branch's newer commit, instead of the release number.
- An update of the journal installs the journal and nothing else: it no longer pulls the code-commandments plugin's newest release first, which 4.4.4 made it do and which crashed the update tonight on a linked skill folder; a plugin is upgraded only by `journal plugin upgrade`. An update whose thread fails takes its marker down, so the viewer's update cover never stays up over a dead update; and a plugin's linked skill folder is unlinked when the plugin's skills are withdrawn, not removed through the link.
- A worker's or a subagent's chat shows its words again and draws a run of tool calls as a card: the transcript's turns lacked the kind the chat switches on, so every one came out as an empty bubble.
- A worker's dialog shows its chat and transcript again: the viewer waited for an agent row the worker never has before it asked for the transcript, so the tabs stayed grey. A running Codex worker's conversation is found too, by the rollout Codex writes for the project's folder, before the worker's answer names its session.
- A fact, a rule or a reminder recorded or struck is a card in the chat that opens the row, as version 3 showed it.
- A row named with a place in it, doc 55:120, doc 55:10-14 or doc 55:section 3, is a chip in the chat that opens the document scrolled to that line or section, and only scrolls when the document is already open in the inspector or in discussion mode.
- A command's created trailer names only the rows the command's own words did not name: `journal message send` no longer says `message 9 sent` and `created: message 9` both.
- A new-message line typed to the agent counts as arrived once the agent reads the message, whatever the prompt hook saw, so a dead hook no longer has it typed again six times; and the chat gets one card when a line is given up on, instead of one per try.
- A document's Show more stays as the user left it while the agent writes the document: the fold's state was made anew with every redraw of the row, so each update of a document being read folded it shut again.
- Comments on a row form threads, as in version 3: Reply under a comment in the comments column writes the answer beneath it, and the agent's reply to a comment (`journal message send --reply-to N`) joins the thread under it, linked to the row. A comment deleted in the column leaves it at once; before, the row stayed in the column until the page was reloaded, since the viewer dropped it only from the messages.
- A permission question the agent's provider asks anyway, Claude Code's "Do you want to proceed?" before a dangerous command, is answered with yes by the journal when the launch skips the permission prompts; under a launch that keeps them it is left to the user, as before.
- Discussion mode on a document opened from the chat: a Discussion button at the top of its comments column widens it to the whole window, the chat on the left, the document in the middle and the comments on the right, so the user reads, selects and comments while the chat goes on; the button closes it again.
- Lines typed to the agent go at most once every five seconds: a line that comes within the window of the last is held, and when the window is up the held lines go as one line, the journal's instructions in order. Settings, Delivery, Type lines at most every sets the window; 0 types each line at once.
- A pin above the chat opens a document or any row of the journal in place, as a click on its card does, when its link is the row's ref (`journal notice create "<title>" --link docs:55`) or the journal's own address opening it; an outside address still opens in a new tab.
- The tour no longer plays again after an update or a layout change. A settings save from the viewer named only the key it set, and the server dropped every other key under the same heading, so a pane layout or a colour scheme saved after the tour took its finished mark away. A save now changes only the keys it names, null clearing one; the viewer sends a value back at its default as null.
- A comment on a document's passage is read with the passage: `journal message read` prints the quoted lines under the comment, where it said only how many there were. The inspector's page keeps room under its content, so a long document's Show more button no longer sits under the comment box.

## 4.4.9

- A launch no longer starts a second journal server while this project's server answers: the journal it starts stands by, and takes over the moment the first is gone. Before, a second launch of the same project took the next port and overwrote the port file; when that launch ended, every hook and journal command of every agent in the project went to a dead port: nothing recorded, nothing typed, "no environment" on the commands, and the band stuck at "journal starting…".
- A journal takes its port when it starts serving, never when it is built, so one snapshot by holds none.

## 4.4.8

- The journal dispatches a journal started event once it has started the agent here and sent its start block, on a new conversation and on a resumed one; it is a trigger on the canvas, Journal started. The agent's greeting is a listener on it: an introduction in a new conversation, and in a resumed one a word that it is back, which 4.4.7 never typed.
- A line typed to the agent that was lost, to a dialog or a program still loading its conversation, is typed again up to six times, each after twice the wait, over five minutes; three tries in thirty seconds gave up while Claude Code was still loading, and the first lines of a session were lost.

## 4.4.7

- A new environment named at the launch gets its row before the agent starts. Without it every hook and command in that environment was refused, so the agent seemed to run in no environment at all.
- `journal environment rename <name> <new>` gives an environment a new name with everything recorded in it; refused while an agent works there or while it has a worktree named after it.
- The Codex launch runs without Codex's shared daemon (4.4.6), checked live: its hooks and commands now land in the environment chosen at the launch, where the daemon kept the environment of its first launch days ago and sent everything to main.

## 4.4.6

- Codex starts in the environment chosen in the launch menu. Each launch uses its own process, so a shared background server cannot carry over another project's environment or connection.
- Journal commands recognize Codex's session, with or without a running journal server. Reading the environment clears the startup check for that session, and its commands are recorded as the agent's.
- A blocked task with nothing that opens it by itself is named plainly.
- Reading or searching through a shell command shows the figure's book or magnifying glass, and the watch is larger.
- The file edits list reads only the newest fifty edits instead of loading the whole session's history.

## 4.4.5

- The task titles in the rail's task list show again; 4.4.3 squeezed them out when the list was made to scroll.
- A file changed by a shell command, a script or a sed, shows its changed lines in the file edits, told against the last version the journal saw of it, as a tool's edit does.
- A wait names what ends it: `journal await "<what>" --output <n>` ends when that command's output is done, and `--until "<script>"` is run every 30 seconds and ends it once it passes. The wait clears by itself and the agent is told what it came to. A wait that names neither, or a wait on the user, is refused.
- A plan's timeline opens in the side column beside the plan, as in version 3, and the shared plan view keeps it there too.
- Scrolling to the top of the chat loads one earlier page, then waits two seconds before the next, so it no longer pulls in the whole history.
- The About page's fresh read of the releases waits on GitHub and is no longer flagged as a slow request.

## 4.4.4

- An update keeps a marker file while it runs, `.journal/runtime/updating.json`: a second update waits for the first, the viewer's update cover stays up through the restart and cannot be dismissed, and the journal that comes up says whether the update finished. What the install printed is kept in `.journal/runtime/update.log`, and an install that did not restart the journal is followed by a restart.
- The About page reads the releases fresh from GitHub each time it opens, and no longer says the journal follows a branch.
- A worker's shell commands are its own: they are never moved to the background as the main agent's, nor their ends typed into the main agent's terminal. A subagent's command is never moved to the background either.
- A worker opens in its own near full-screen dialog, with its brief, report and conversation.
- Messages between agents' sessions reach the chat both ways: one the agent sends with Claude Code's own messaging, and one another session sends it, mid-turn or as a prompt, each in a full-width bubble saying who sent it or to whom. A message from another session is written by an external agent, never by the user.
- A line typed to the agent is never longer than one line holds, a failing check tells the agent only the end of its output, and a piece of a typed line that reaches the agent is the journal's, never taken for the user's words.
- Each thought in the chat carries an Agent thought header.
- A parked task is named when a task closes, by a workflow on the canvas.
- `journal output read --tail` and the viewer's transcript read only as far as they need, so a long output or transcript no longer costs a whole read each time.
- The version 3 notice says plainly that it copies your version 3 data into version 4.

## 4.4.3

- On a Mac the installer installs Python 3.14 from python.org's own installer, which needs no Xcode; Homebrew builds Python from source on a macOS it no longer has packages for, and failed there on an older Xcode. uv is still used first where it is installed.
- `journal update` installs the newest release of this major version as Install update does and restarts the journal on it; `journal update check` says whether one is out.
- Claude Code's "Switch model?" question is answered while a busy spinner still counts above it; the question read from the screen stops at the line drawn above the menu.
- Closing the terminal window an agent runs in no longer leaves a fault in the supervisor's log.
- The Settings tabs stay in view while the page scrolls, and Updates and Record sit on the System tab; the tasks list in the rail scrolls; a file edit opened in the chat stays open after a tab switch.
- An accepted suggestion settles its card in whichever environment it was shown.

## 4.4.2

- Where git is missing, the installer offers to install it, with Homebrew or, on a Mac without it, the command line tools, as it does for Python 3.14.

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
- Every shipped workflow is drawn from these parts, typed the agent what it did before: the quiet clocks note their time on the move that starts the wait and on the agent's own events, and the cadences count their own tool uses, writes and lines. No check keeps a clock or works out a count out of sight any more.
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
