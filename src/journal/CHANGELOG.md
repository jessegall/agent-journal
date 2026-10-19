# Changelog

What each release of agent-journal version 4 brought, newest first.

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
