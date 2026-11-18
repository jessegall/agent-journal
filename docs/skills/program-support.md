# Skill delivery per program

How the journal's published skill set reaches each pinned program, under the isolated launch the journal uses
(tools/journal-agent/profiles). The evidence is in the task 629 report.

## Versions

| Program | Pinned build | Checked with |
|---|---|---|
| Claude Code | 2.1.323 | `claude --version` |
| Codex | codex-cli 0.165.0 | `codex --version` |

## Claude Code 2.1.323

- Mechanism: a per-session plugin folder passed with `--plugin-dir <target>`, beside the journal's
  `--settings <isolated settings.json> --setting-sources "" --strict-mcp-config --agents {}`.
- Layout of the folder: `.claude-plugin/plugin.json` (name `journal-session-skills`) and
  `skills/<key>/SKILL.md`. The program names each skill `journal-session-skills:<key>`.
- The target may be the journal's pointer symlink to a staged folder: the program follows it.
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

- Mechanism: `$CODEX_HOME/skills`, inside the journal's isolated `CODEX_HOME` for the launch. The folder may be the
  journal's pointer symlink to a staged folder of `<key>/SKILL.md`: the program follows it.
- `.agents/skills` in the checkout is discovered too, but the journal does not write into a checkout for this.
- The user's `$HOME/.agents/skills` is discovered as well, whatever `CODEX_HOME` is. The feature
  `skip_host_skill_discovery` (under development) does not change that. Each `SKILL.md` found there at launch is
  switched off with `-c skills.config=[{path="<absolute SKILL.md>", enabled=false}, ...]`, which removes it.
- Instruction for a skill: the absolute `SKILL.md` path to read.
- Reload: new session. A skill added between two turns of one thread is offered by `codex exec resume`, which starts
  a new process.

## Not used

- Copying an account skills folder, or turning on user or project setting sources.
- `.codex/skills` (legacy) as a destination.
