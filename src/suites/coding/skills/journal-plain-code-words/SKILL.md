---
name: journal-plain-code-words
description: Name every variable, method, class and file in plain words, by a ladder; read it at the start of every session
---

# Plain code words

Every name you write says literally what the thing is or does, in ordinary words a newcomer reads at once: a variable,
a parameter, a method, a class, a constant, a file, a folder, a table and its columns, a command and its flags. A name
that needs working out is a bug: the next reader guesses, guesses wrong, and writes the second copy beside it.

## The ladder for a name

Before you write a name, go down these steps. Stop at the first that gives you a name.

1. **Does the codebase already name this thing?** Search for it. The same thing gets the same word everywhere: a task
   is a `task`, never a `job` in one file and a `work_item` in the next. Reuse the word and its spelling.
2. **What is it, in one ordinary noun?** A value is named for what it holds (`deadline`, `open_tasks`,
   `agent_number`), never for its type (`data`, `obj`, `value`, `info`, `result`) or for where it came from (`row2`,
   `tmp`). Several of them is the plural (`tasks`); a count says `count` (`task_count`).
3. **What does it do, in one verb?** A method that changes something is a plain verb (`close`, `send`, `merge`). One
   that answers is named for its answer (`deadline()`, `open_tasks()`). A question answering yes or no reads as one
   (`is_open`, `has_tests`, `can_merge`). Never a verb that only sounds active (`handle`, `process`, `manage`, `do`).
4. **Is it a class?** Name it for the one thing it is (`MergeRequest`, `TaskOverview`), never for a role it plays in
   a pattern (`Manager`, `Helper`, `Util`, `Service`) unless the pattern is the thing. One class to a file, and the
   file is the class name in its language's case (`merge_request.py`).
5. **Is it a file or a folder?** Name it for what it holds, as the class or module inside does. A folder groups by
   subject (`workers/`, `plans/`), never by kind of code (`helpers/`, `misc/`, `common/`).
6. **Does the name need a comment to be understood?** Then the name is wrong: put the comment's words into the name, and
   drop the comment. A class keeps one line at its top saying what it is, written for a newcomer.
7. **Is a word on the project's forbidden lists, or poetry?** (`about`, `said`, `whisper`, `tale`, `magic`, `stuff`,
   `thing`.) Replace it with the plain word for what it holds or does. The lists are in the project's rules.

## Checks before you finish

- Read each new name aloud as a sentence: `if task.is_open`, `deadline = plan.deadline()`. If the sentence is odd, the
  name is.
- Two names for one thing, or one name for two things: make it one each.
- A rename reaches every place: callers, tests, texts and documents. Use a rename tool that finds every reference,
  never a search and replace by hand.
- Words a person reads (messages, refusals, screen text) are plain sentences, never a column or variable name
  (`since your last skip`, never `skipped_at`).
