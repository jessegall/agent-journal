# Contained capability runs

The runs on the test server (Ubuntu 26.04, x86_64, Docker 29.7 with the classic image store, the agent daemon
`docker:28-dind-rootless` under `.docker/helper/apparmor-agent-daemon`) that set rows of
`docs/accounts/container-capabilities.json` for Claude Code 2.1.323 in `required_container`. The agent image is
`sha256:c97cd8c276ef3e646ae0feee9690ff29f23b1c4692e456fe3c66966c57805cd1`, the runner image
`sha256:bbdbdc31c9ba02d6f37090b9de9377e685a21a937730088da271046b380bb314` (2026-11-21). Each container below runs as
the agent user 10001 with no network, every capability dropped, `no-new-privileges` and the agents' seccomp profile
`.docker/helper/seccomp-agent.json`, the options of `Containers::RunCheck`.

## process-tracking: supported

A container's program starts four kinds of descendant: a background child, a child of a subshell that exited, one
detached into its own session with `setsid`, and one that ignores TERM. The host's process table shows all of them,
then none once the agent daemon stops the container within its 10 second bound: ending the container's PID 1 ends
its PID namespace, and every process in it with it.

```
== the container's descendants in the host's process table (pid, ppid, session, command):
1304819 1304795 1304819 sh -c sleep 661 & (sleep 661 &) ; setsid sh -c 'sleep 661' & nohup sh -c 'trap "" TERM; ...
1304832 1304819 1304819 sleep 661
1304834 1304819 1304819 sleep 661
1304835 1304819 1304835 sh -c sleep 661
1304836 1304819 1304819 sh -c trap "" TERM; sleep 661
1304837 1304835 1304835 sleep 661
1304838 1304836 1304819 sleep 661
== stop, 10 s bound
running after the stop: false
== left in the host's process table:
none
```

The agent daemon cannot list a container's processes itself (`docker top` fails: it has no cgroup for the
container), so the host proves an end by the container's state and the PID namespace, never by `docker top`.

## container-runtime: supported

The daemon answers on its socket alone and holds exactly the two pinned images; `agent-images` removes any other and
loads the archives only when a pin is missing, and `agent-host` checks both pins before it serves. With no daemon at
its socket, a contained host refuses to serve with the named refusal (story 64 of doc 61):

```
$ journal-agent serve --arrangement=contained --docker=unix:///run/agent-docker/missing.sock ...
journal-agent: the agent container runtime cannot be reached: Cannot connect to the Docker daemon at
unix:///run/agent-docker/missing.sock. Is the docker daemon running?
```

The kernel control holds since the agent daemon runs as a rootful `docker:28-dind` under Sysbox (`sysbox-runc`, task
1636). The rootless image had no cgroup driver: rootless Docker enforces budgets only through a systemd user manager,
so `--cpus`, `--memory` and `--pids-limit` were accepted and discarded. Under Sysbox the daemon owns its cgroup
namespace and runs the cgroupfs driver, so the budgets every agent container is created with
(`tools/journal-agent/host/container.go`) hold. On the test server (Ubuntu 26.04, kernel 7.0, Sysbox 0.7.1):

```
$ docker info --format 'driver={{.CgroupDriver}} cgroup={{.CgroupVersion}}'
driver=cgroupfs cgroup=2
$ docker run --rm --pids-limit 8 ... sh -c 'start 10 background sleeps'
sh: 0: Cannot fork
$ docker run --rm --memory 64m --memory-swap 64m ... sh -c 'head -c 200000000 /dev/zero | tail'
Killed
```

The ninth process is refused and the 200 MB buffer is killed under its 64 MB limit. The settings are
`AGENT_DAEMON_IMAGE=docker:28-dind`, `AGENT_DAEMON_RUNTIME=sysbox-runc`, `AGENT_DAEMON_DATA=/var/lib/docker` and
`AGENT_DAEMON_SOCKET_GROUP=1000`, after Sysbox is installed on the server (the contained installation document, task 1502, holds the steps).

## relay-protection: unsupported

The contained host's protection report, recorded on the host's row (`hosts.protection`, `claude-code@2.1.323`,
platform `linux-container`), sets every item unenforced with the same reason: Claude Code's sandbox does not start in
the agent container, `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`. The agent daemon gives each
agent container Docker's masked `/proc` paths, and the kernel refuses a fresh `/proc` mount under them; lifting the
mask for agent containers would expose the paths it hides to the model's tools. Without the sandbox, hook commands
and the Bash tool run as the same user in the same container, so the relay's material is readable by model-run
descendants.

## The other three

callback-separation, completion-fence and stop-deadline are properties of a launched Claude Code session: its hook
callbacks, its completion and its Stop hook. They need a signed-in Claude Code launched in an agent container by the
host, which the contained start of plan 37's later phases builds; their rows stay unverified until those runs are
recorded here.
