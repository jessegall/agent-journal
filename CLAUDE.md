<!-- BEGIN: code-commandments skills (auto-generated, run `composer update`) -->
@AGENTS.md

## Working here as Claude Code

The briefing above is the canon, shared with every agent. These are the parts of it
that have a specific name in this harness:

- **Load a skill with the Skill tool**, by the exact id in the briefing's bullets —
  e.g. `commandments-php-absence`. The published skills are linked into
  `.claude/skills/`, so they also autocomplete as `/`-commands.

**The disciplines here are ENFORCED, not just written down.** The agent journal's
code-commandments plugin judges what you change and raises each sin in the chat; the
package's own hooks step aside. That is a property of this agent alone — under an
agent with no hook protocol the same disciplines are documents you are asked to follow,
and nothing checks that you did.
<!-- END: code-commandments skills -->

## Private data

Never commit private data: no messages, transcripts, recordings, corpus lines, keys or files from a person's
own folders. A recording or private file used for a test is stripped and sanitised first: names, paths, message
text, ids and tokens are replaced with made-up values, and only the sanitised copy is committed (message 109950).
