# Skill delivery per program

How the journal's published skill set reaches each pinned program, under the isolated start the journal uses
(programs/agent/profiles). The journal runs in a container the host's programs cannot read, so the start grant
carries the delivered files and the host writes them into the runtime's own settings folder before it spawns the
program (host.WriteStartFolders). Evidence: report 171 (discovery) and report 174 (live delivery).

## Versions

| Program | Pinned build | Checked with |
|---|---|---|
| Claude Code | 2.1.323 | `claude --version` |
| Codex | codex-cli 0.165.0 | `codex --version` |

## Claude Code 2.1.323

- Mechanism: a per-runtime plugin folder, `<settings folder>/journal-skills`, passed with `--plugin-dir`, beside the
  journal's
  `--settings <isolated settings.json> --setting-sources "" --strict-mcp-config --agents {}`.
- Layout of the folder: `.claude-plugin/plugin.json` (name `journal-session-skills`) and
  `skills/<key>/SKILL.md`. The program names each skill `journal-session-skills:<key>`.
- The program also follows a symlinked plugin folder.
- Not discovered under these flags: `.claude/skills` in the checkout and the user's `~/.claude/skills`.
- Skill tool: the journal profile denies `Skill` as a delegation route. The program still loads the plugin skills (the
  stream-json `init` event lists them under `skills`), but the model is not told about them. The instruction for a
  skill is therefore the absolute `SKILL.md` path to read with Read. When a profile allows `Skill`, the `init` event
  lists `Skill` under `tools` and the model can call `journal-session-skills:<key>`.
- Reload: new session. Skills are listed when the process starts; a skill added later is listed by the next start.
  The program offers `/reload-skills` and `/reload-plugins` only as manual commands.
- The program treats files in its skill folder as sensitive: an agent's Write there needs approval, so an agent cannot
  change its delivered skills.
- Bundled skills that ship inside the binary (such as `deep-research`, `design`, `code-review`) are listed whatever
  folder is passed; the plugin folder adds to them.

## Codex 0.165.0

- Mechanism: `$CODEX_HOME/skills` of `<key>/SKILL.md`; the start's settings folder is its isolated `CODEX_HOME`.
- `.agents/skills` in the work folder and the user's `$HOME/.agents/skills` are discovered as well, whatever
  `CODEX_HOME` is; the feature `skip_host_skill_discovery` (under development) does not change that. The Codex profile
  switches off each `SKILL.md` found there at start with
  `-c skills.config=[{path="<absolute SKILL.md>", enabled=false}, ...]`, logs its path, and leaves it unchanged.
- Two agents sharing one login (`auth.json` linked into each CODEX_HOME) keep separate sets (report 174).
- Instruction for a skill: the absolute `SKILL.md` path to read.
- Reload: new session. A skill added between two turns of one thread is offered by `codex exec resume`, which starts
  a new process.

## Not used

- Copying an account skills folder, or turning on user or project setting sources.
- `.codex/skills` (legacy) as a destination.
