package host

// linuxMechanisms is what the pinned clients can apply on Linux before their tools run, given what Claude Code's
// sandbox has there. A mechanism listed here still needs native evidence before the item counts as enforced.
func linuxMechanisms(claude ProgramMechanisms) map[string]ProgramMechanisms {
	return map[string]ProgramMechanisms{
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
func claudeSandbox() ProgramMechanisms {
	return ProgramMechanisms{
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

// claudeWithoutSandbox is every item unavailable for the one reason Claude Code's sandbox cannot run.
func claudeWithoutSandbox(why string) ProgramMechanisms {
	missing := ProgramMechanisms{}
	for _, item := range BoundaryItems {
		missing[item] = unavailable(why)
	}

	return missing
}
