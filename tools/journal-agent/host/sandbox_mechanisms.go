package host

// linuxMechanisms is what the pinned clients can apply on Linux before their tools run, given what Claude Code's
// sandbox has there. A mechanism listed here still needs native evidence before the item counts as enforced.
func linuxMechanisms(claude DriverMechanisms) map[string]DriverMechanisms {
	return map[string]DriverMechanisms{
		"claude": claude,
		"codex": {
			AccountSecrets: unavailable("the workspace-write Landlock sandbox limits writes only, " +
				"so a command can read auth.json under CODEX_HOME"),
			ForeignHistory: unavailable("the workspace-write Landlock sandbox limits writes only, " +
				"so a command can read other threads' sessions"),
			Keychain: unavailable("Codex has no setting that refuses the session D-Bus secret service to its " +
				"commands"),
			ControlSockets:    unavailable("Codex's seccomp filter refuses network sockets but not Unix sockets"),
			ProcessInspection: unavailable("Codex's sandbox shares the process namespace of the host"),
			InstallWrites: native("the workspace-write Landlock sandbox: writes only in the work folder " +
				"and the thread's writable roots"),
		},
	}
}

// claudeSandbox is how Claude Code's bubblewrap sandbox applies each item once bwrap and socat run.
func claudeSandbox() DriverMechanisms {
	return DriverMechanisms{
		AccountSecrets: native("sandbox.enabled with permissions.deny Read on the account's sign-in items: " +
			"the bubblewrap mount namespace for Bash and its children, the permission check for file tools"),
		ForeignHistory: unavailable("every session of an account keeps its history in one projects folder, " +
			"and a native read rule cannot tell this session's history from another's"),
		Keychain: native("sandbox.enabled bubblewrap namespace without the session D-Bus socket, " +
			"and permissions.deny on Bash(secret-tool:*)"),
		ControlSockets:    native("sandbox.enabled bubblewrap namespace with no allowed Unix sockets"),
		ProcessInspection: native("sandbox.enabled bubblewrap PID namespace"),
		InstallWrites: native("sandbox.enabled writes only in the work folder, and permissions.deny Edit " +
			"on the accounts folder"),
	}
}

// claudeProtected is how a protected-account start keeps each item from the model's tools without Claude Code's own
// sandbox: every command the model runs is a process of the executor's user 10002, and the program's file tools obey
// the image's managed policy (docs/accounts/claude-integration.md, sections Shell handoff and Managed policy).
func claudeProtected() DriverMechanisms {
	return DriverMechanisms{
		AccountSecrets: native("uid 10002 executor through CLAUDE_CODE_SHELL for Bash and its children, which cannot " +
			"read the account folder of uid 10001; managed permissions.deny on the account folder for the file tools"),
		ForeignHistory: native("each session's own history volume over the account's projects folder"),
		Keychain: native("the agent image runs no session D-Bus or secret service, and the executor's uid 10002 " +
			"reaches nothing of uid 10001"),
		ControlSockets: native("the executor socket admits only uid 10001, and the commands of uid 10002 reach no " +
			"socket of the program"),
		ProcessInspection: native("the client runs as another uid: /proc environ, fd, root and mem of uid 10001 are " +
			"refused to uid 10002"),
		InstallWrites: native("uid 10002 writes only the workspace (group journal-work) and /tmp; /opt and /etc are " +
			"root-owned, and the managed policy denies Edit outside /workspace and /tmp"),
	}
}

// codexWithoutProtectedStart is every item unavailable until Codex's approvals, features and resume are closed.
func codexWithoutProtectedStart() DriverMechanisms {
	missing := DriverMechanisms{}
	for _, item := range BoundaryItems {
		missing[item] = unavailable("Codex's approvals, features and resume are not yet closed for a protected start (plan 45, task 1768)")
	}

	return missing
}

// claudeWithoutSandbox is every item unavailable for the one reason Claude Code's sandbox cannot run.
func claudeWithoutSandbox(why string) DriverMechanisms {
	missing := DriverMechanisms{}
	for _, item := range BoundaryItems {
		missing[item] = unavailable(why)
	}

	return missing
}
