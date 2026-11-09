---
name: journal-user-stories
description: Write user stories for any system design from every angle, and group them into story books; read it before you write stories or a functional design
---

# Writing user stories

A story says what changes for someone, so that a reader who never saw your thinking knows who acts, what happens and how to
tell it worked. The written story stands in for the conversation nobody will have, so settle in it everything that conversation
would have settled.

A design holds at least 50 stories, and a large one far more. Fewer almost always means whole angles are missing: the bugs that
hurt live in refusals, failures and recovery, and those are the stories a first pass leaves out.

## What makes a story good

- It describes a change in behaviour that someone can see. If every check could pass without the change happening, rewrite it.
- It is about an outcome, never a screen, a button or a technical step. Technical work is a task, not a story.
- Say how much where it matters: how much faster, how many, within how long.
- Its title states the actual behaviour: "Refused login after five wrong passwords", never "Login". The titles of a book read
  together should tell you what the system does.

## Who acts

Name a specific actor in every story, because "a user" hides who the rule is for.

- Sharpen a role with its situation instead of inventing roles: a first-time visitor, a member who forgot their password.
- An actor can be another system, a timer or a background job. Name it, what triggers it and what can be observed afterwards.
- Hostile and careless actors are actors: an attacker, someone abusing a limit, someone who clicks twice without meaning to.
- People who never touch the system but care about the result have interests. Write what they must be able to rely on.

## Which form to use

| Form | Use it when |
| --- | --- |
| As a <who>, I want <what>, so that <why> | Who acts matters and users differ. The reason must add something real, or drop it. |
| When <situation>, I want <motivation>, so I can <outcome> | The work starts from a trigger or event, as with a system or a job. |
| Given, When, Then | Pinning one rule down with one concrete example. |

Use whichever fits; a form is there to make you think, not to be filled in.

## Writing the examples

- One example shows one rule, in three to five steps. A longer one has stopped showing anything.
- Given holds exactly the context the rule needs. When is one event. Then is something observable.
- Describe what happens, not how: if the wording would change when the implementation does, rewrite it.
- If you cannot state the outcome, you have found a question. Write the question down and get it answered.
- Give a story three to five acceptance criteria, including what would make someone reject the work and what is out of scope.
  Past that, the story is too big.

## Covering every angle

Work through this in order. It finds what reading the design again will not.

1. List every actor, including systems, hostile users and careless ones.
2. List each actor's goals, in the order you would explain the system. Walking them in order shows the gaps a flat list hides.
3. For each goal, write a story for every path below that applies.
4. For each story, ask what the benefit is. Work that would not deliver it means a story is missing.
5. Ask what would make someone reject this, then read the whole list aloud as one walk through the system.

| Path | Ask |
| --- | --- |
| Success | What does the actor see when it works? |
| Variation | What other data, entry route or rule changes the outcome? "Manage" hides several operations. |
| Empty and boundary | None, one, many, the limit, just past the limit, very long, odd characters, midnight. |
| Refusal | What is the actor not allowed to do, and when? |
| Failure | At each step, what can go wrong? Name what was detected. |
| Recovery | After a failure or a refusal, what can the actor do next, and what is kept? |
| Concurrency and repeat | The same thing twice, or two actors at once. |
| Interruption | The process dies, the machine restarts, the actor walks away halfway. Who picks it up? |
| Abuse | Name the specific attack, never a general wish for security. |

### Refusals, failures and recovery

These decide whether the system can be trusted, so write them as carefully as the success case.

- A refusal states what was asked, the answer the actor sees, what stays unchanged and what the actor can do next.
- A failure states what was detected, what still holds afterwards and whether the actor can try again.
- Recovery names who notices and who acts. A story where something stops and nobody is told is the bug, so write who gets told.
- An error message says what went wrong and what to do about it, and gives an attacker nothing.

### Security and abuse

- Write the attack as a story: "As an attacker, I change the id in the address to read another member's record".
- Walk each asset and flow for spoofing, tampering, denying an action, leaking information, denial of service and gaining rights.
  A threat with no countermeasure is a vulnerability.
- A countermeasure is often a story of its own, with its own abuse to consider.

### Speed, scale and other properties

A property such as speed belongs in one story that establishes it and a standing rule that keeps it. Left out, stories get called
done while the property is not met.

## Splitting

- Keep every story a thin slice through the whole system, never one layer of it, so each can be delivered and checked alone.
- Split along workflow steps with the simple end-to-end case first, then by operation, rule, data, entry route, or simple and
  complex.
- More than five or six examples, or many rules under one story, means it should be split.
- Check each story is independent, negotiable, valuable, estimable, small and testable.

## Story books

Group related stories into a book: the refusals of one feature, its failures, its recovery. A planner makes one task of each book,
so give every book a name and say when it is done, and give every story a title that can stand alone in that task's brief.

## Mistakes to avoid

- A story with no clear actor.
- A story so vague nothing can check it, or so detailed it dictates the solution.
- Only the success path.
- Treating the written story as the whole requirement instead of writing down the questions it raises.
- Splitting a story into tasks and calling those stories.
