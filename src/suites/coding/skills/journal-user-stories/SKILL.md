---
name: journal-user-stories
description: How to write user stories for any system design, from every angle: who acts, which form, refusals, failures, recovery and abuse; read it before you write stories
---

# Writing user stories

A user story describes a change in what a system does, seen from whoever meets that change. Write stories so that someone who
has not seen your thinking knows who acts, what happens, and how to tell it worked.

Marked **(inferred)** is judgement drawn from the sources, where the literature is silent. Everything else has a named source.

## What a story is

- A story is a card, a conversation and a confirmation (Jeffries). The written part is a reminder (Cohn), and conversation is
  the most important part (Wake). A design has to stand in for that conversation, so spell out what a conversation would settle.
- Describe a change in behaviour, not only a behaviour. A story that passes every check but does not produce the change is not
  complete (Adzic). Say how much where you can: how much faster, how much larger.
- A story is not a screen, a button, a component or a technical step (Agile Alliance). Technical work does not need to be
  disguised as a story (Cohn). Keep it as a task.

## Who acts

- Name a specific actor. If you do not know who the users are, you should not write stories yet (Pichler). A set where every
  story opens "As a user" means the user does not matter there, and the template is the wrong tool (Cohn).
- Refine a role with a decoration instead of inventing more roles: a first-time visitor, a member who forgot their password (Cohn).
- An actor can be another system or external hardware (UML, Cohn). One thing can play several actors.
- A hostile actor is an actor. Use a malicious, an abusive and an unknowing user (OWASP). A misuser is not always human, and
  can act by accident (Sindre and Opdahl).
- For a system or service, name the system as the actor and state its trigger and its observable outcome as you would for a
  person **(inferred)**. No source gives a template for this, and none treats time as an actor.
- Stakeholders who never touch the system are not actors but do have interests. Cockburn's template records them.

## Which form to use

| Form | Use it when |
| --- | --- |
| As a <who>, I want <what>, so that <why> | Who acts matters, and users differ. "So that" is the most important part but optional (Cohn); it must add a real reason. |
| When <situation>, I want <motivation>, so I can <outcome> | The job matters more than who does it, or the work starts from a trigger or event (Cohn, Klement). |
| Given, When, Then | Giving concrete examples of one rule (Cucumber, North). Good for specifying, weaker for talking to customers (Cohn). |

Templates are "training wheels" (Agile Alliance). When one does not fit, do not use it (Cohn).

Give every story a title that describes actual behaviour (North): "Refused login after five wrong passwords", never "Login".

## Writing the examples

- One example shows one rule. Three to five steps; longer and it loses its force (Cucumber).
- Given holds all of the required context and no more; one event per example (North). Examples of a story differ in their
  givens and outcomes, and their titles alone should tell you how.
- The outcome is something observable (Cucumber, Adzic). Describe what, not how: if the wording would change when the
  implementation does, rewrite it (Cucumber).
- If you cannot state the outcome, you do not have an example, you have a question (Wynne). Write the question down.
- Three to five acceptance criteria per story (Pichler). Include what would make someone reject the work, and say what is out
  of scope (Cohn). A long list means the story is too big or you are writing test cases.
- Criteria that merely restate the story, or that hide further stories, are a known failure (Pichler).

## Covering every angle

No source gives a formal completeness test. Judge coverage against actors, goals and paths **(inferred)**. A design holds at least
50 stories: fewer almost always means whole angles are missing, and a large design holds far more.

1. List the actors, including systems, hostile users and careless ones.
2. List each actor's goals. Lay them out in the order you would explain the system; a flat list hides gaps, walking a map finds
   them (Patton). The stories that make the smallest end-to-end system come first.
3. For each goal, write each path that applies **(inferred)**:

| Path | Ask |
| --- | --- |
| Success | What does the actor see when it works? |
| Variation | What other data, entry route or rule changes the outcome? "Manage" hides several operations (Lawrence). |
| Empty and boundary | None, one, many, the limit, just past the limit, very long, odd case, time boundaries (productkind). |
| Refusal | What is the actor not allowed to do, and when? |
| Failure | At each step, what can go wrong? Phrase it as what was detected (Cockburn, by secondary sources). |
| Recovery | After a failure or a refusal, what can the actor do next, and what is retained? |
| Concurrency and repeat | The same thing twice, or two actors at once **(inferred)**. |
| Abuse | Name the specific attack; a generic security requirement is useless (OWASP). |

4. Check the benefit: if the work would not deliver the stated benefit, a story is missing (North).
5. Ask what would make someone reject this, and which edge cases matter enough (Cohn).
6. Walk it with someone: reading the map aloud surfaces missing steps (Patton).

### Refusals, failures and recovery

Sources are thin here, so most of this is **(inferred)**.

- A refusal is an extension of a goal. State what the actor asked, the system's observable answer, what state is preserved, and
  what the actor can do next.
- A failure states what was detected, what still holds afterward (Cockburn's minimal guarantees), and whether the actor can retry.
- An error message says what went wrong and what the actor can do; it must not leak (OWASP on account harvesting).
- Happy case and edge cases can be separate stories (productkind). Prioritise; not every edge case needs writing up front (Cohn).

### Security and abuse

- Write abuse cases as "As an attacker, I ...": "As an attacker, I change the primary key to read another user's record" (OWASP).
- Walk STRIDE over each asset or flow: spoofing, tampering, repudiation, information disclosure, denial of service, elevation
  of privilege (OWASP, Microsoft). A threat with no countermeasure is a vulnerability.
- A misuse case often creates a story for its countermeasure, which may have a misuse case of its own (Sindre and Opdahl).
- OWASP itself says abuse cases are rarely used and can feel heavyweight. Select the ones that matter.

### Properties such as speed and scale

Performance, scale and security properties usually belong in a shared definition of done, with one item to establish the
capability and a standing rule to keep it (Cohn). Deferring them makes it easy to call stories done that are not (Lawrence).

## Splitting

- Keep stories vertical: a slice through every layer, not one layer (Wake). Splitting by architecture layer fails at independent
  and valuable (Lawrence).
- Splitting patterns (Lawrence, Cohn): workflow steps with the simple end-to-end case first, operations, rule variations, data
  variations, entry methods, simple and complex, deferring performance, and a spike as a last resort.
- More than about five or six scenarios means a story can probably be split, along business lines (North). Many rules under
  one story means the same (Wynne).
- INVEST is a useful check: independent, negotiable, valuable, estimable, small, testable (Wake). It is "a small tool".
- In a truly unknown domain do not try to find all the stories. Find the one or two that teach you something (Lawrence).

## Mistakes to avoid

- Not everything is a story (Pichler).
- A story with no clear actor (Pichler).
- Too vague, or so detailed it prescribes the solution (Pichler, Cohn).
- Treating the written story as the whole requirement (Cohn, Wake).
- Splitting stories into tasks: tasks organise work, stories describe outcomes (Cohn).
- Using a template without thinking (Cohn).

There is no good evidence that user stories themselves raise success or productivity, and they are unsuited to contracts
(Wikipedia's summary of criticism). They help a team think. They prove nothing on their own.
