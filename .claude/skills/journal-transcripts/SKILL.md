---
name: journal-transcripts
description: "Transcripts: a meeting transcript or summary sent to the journal as a thing of its own — what makes one a transcript rather than a long message, what the agent does with one (read it, analyse it, research what it refers to, file the to-dos, propose a plan that waits), how the transcript is stored as its own file outside the document catalogue, and how a to-do or plan says which transcript made it. Use it whenever a message arrives declared as a transcript, whenever a long paste reads like one, and before filing anything out of either. Not for subagents."
---

# Journal transcripts

**Not for subagents.** A subagent reports what it found; the main conversation files it.
It is one of the journal's skills; the core `journal` skill says when each applies.
Every command runs through `.journal/journal.py`; `journal` is an alias for it.

## A transcript is a thing you are SENT, not a long message

    a meeting recording, a call summary, a pasted conversation      a transcript
    the user telling you something, at any length                   a message
    what stays true afterwards                                      a doc

A transcript arrives **declared**: the user sends it as one, and that word is the
instruction. Nothing is inferred from its size or its file extension — a declared
transcript is a transcript at forty words or forty thousand.

    journal messages add "<the transcript>" --kind=transcript

The kind rides on the message, the viewer shows it as a **Transcript** rather than a
message, and the wake line that reaches an idle agent says what arrived.

## What you do with one

Reading it is not filing it. A transcript is worked in this order, and the order matters
because the cheap corrections come first and the expensive one comes last:

1. **Read the whole thing before filing anything.** A decision in the last paragraph
   routinely undoes one in the first.
2. **Analyse it**: what was actually decided, what was merely discussed, and what was
   somebody thinking aloud. Only the first two are ever work.
3. **Research what it refers to.** A transcript names things — a file, a bug, a release —
   and the journal already knows about most of them. `journal search`, `journal todos
   search`, `journal docs search`. A row filed without that check duplicates one that
   exists.
4. **File the to-dos**, quoting the user's own words:
       journal messages process <n> --part="<their words>" --became="todo 7"
       journal todos add "<title>" --transcript=<n> --brief
   `--transcript=<n>` marks the row with the message whose transcript produced it, so the
   row says where it came from and opens it. The number is checked: a message carrying no
   transcript is refused rather than tagged.
5. **Propose a plan, and let it wait.** What reads as a plan is DRAFTED, never activated —
   `plans add` leaves a draft and only the user starts it — and the plan links the
   transcript it came out of:
       journal plans link <p> "transcript <n>"

**An excerpt must be the user's own words.** `messages process --part=` is refused unless
the words appear in the message — "that part is not in message N; quote the words it is
about" — so a summary you wrote cannot be filed as something they said. The corollary is
that irrelevant chat is simply never quoted: noise needs no handling, it is left unfiled
and the message still closes.

**Prefer few coarse rows over one per sentence.** A transcript will yield forty candidates
and the user wants the handful that are work. Being wrong about a to-do costs one
correction; being wrong about a plan costs their approval, which is why one is filed
outright and the other waits.

**Say what you filed and what you left.** `journal messages reply <n> "<what landed>"` —
the parts carry the detail, the reply carries the judgement.

## Where the transcript itself lives

**It is its own file kind, and it is not a doc.** A declared transcript is written to
`environments/<env>/transcripts/<n>.md`, its front matter naming what it is and which
message carried it. The document catalogue scans a different tree entirely, so a
transcript is invisible to it **structurally** — nothing filters it out, and nothing can
drift out of step. No menu lists one.

That is deliberate: a transcript is raw material, not something the project keeps and
cites. What stays true out of it belongs in a doc, written on purpose.

**It is reached from the message that carried it** — the message panel opens it, and
`/transcripts/<env>/<n>` serves it — or from a row that names it. Pruning the message
takes the transcript with it, whether it was pasted or attached.
