# To-dos

A to-do is one piece of work to do later. It has a title, and often a brief underneath with the details.

## Who writes them

Mostly the agent. When you ask for something while it is busy with something else, it parks your request here instead of dropping what it is doing. Messages you leave usually become to-dos too.

## What the list shows

- **In progress** is what the agent is working on now.
- **Open** is waiting to be picked up, highest priority first.
- **Done** is hidden until you switch on *Show done*.

## What you can do

- Open a to-do to read its brief, its questions and the work that was done on it.
- Change its priority, so the agent picks it up sooner or later.
- Close or reopen it, or comment on it.

With **auto mode** on, the agent works through the open to-dos by itself, one after another, without asking first. It is one switch for the whole journal: every environment reads the same one, so an agent that moves between them keeps working.

## How the agent uses to-dos

- **Parking a request.** A new request becomes a to-do by default, with `journal todos add` and a brief. The agent switches to it right away only if you said to do it now.
- **Picking one up.** `journal todos start <n>` opens the work. The start of each session shows how many to-dos are waiting.
- **Closing is explicit.** A to-do closes only through `journal todos done <n> "<how>"`, `journal work end "<title>" --todo`, or a commit trailer that names it. Ending work alone does not close it.
- **Auto mode.** With it on, each stop with nothing open hands the agent the next to-do to start.

## Old done to-dos

A done to-do leaves the list on its own 7 days after it was closed. It is moved into the environment's `archived` folder, not deleted, and its number is never given to a new to-do. Change the number of days in Settings, or with `journal todos keep <days>`. 0 keeps done to-dos listed.
