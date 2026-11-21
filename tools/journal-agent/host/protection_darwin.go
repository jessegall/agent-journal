//go:build darwin

package host

// platformMechanisms is what the pinned clients can apply on macOS before their tools run. A mechanism listed here
// still needs native evidence before the item counts as enforced.
func platformMechanisms() map[string]DriverMechanisms {
	return map[string]DriverMechanisms{
		"claude": {
			AccountSecrets: native("sandbox.enabled with permissions.deny Read on the account's sign-in items: " +
				"the Seatbelt profile for Bash and its children, the permission check for file tools"),
			ForeignHistory: native("the host's session Seatbelt profile (sandbox-exec) around the program: only the " +
				"projects folder of the session's own workspace can be read or written"),
			Keychain: native("sandbox.enabled Seatbelt profile with allowUnsandboxedCommands false, " +
				"and permissions.deny on Bash(security:*)"),
			ControlSockets: native("sandbox.enabled Seatbelt profile with no allowed Unix sockets"),
			ProcessInspection: native("the host's session Seatbelt profile (sandbox-exec) around the program: no " +
				"process information about or signal to a process outside the session"),
			InstallWrites: native("sandbox.enabled writes only in the work folder, and permissions.deny Edit " +
				"on the accounts folder"),
		},
		"codex": {
			AccountSecrets: unavailable("the workspace-write Seatbelt sandbox limits writes only, " +
				"so a command can read auth.json under CODEX_HOME"),
			ForeignHistory: unavailable("the workspace-write Seatbelt sandbox limits writes only, " +
				"so a command can read other threads' sessions"),
			Keychain:       unavailable("Codex has no setting that refuses Keychain services to its commands"),
			ControlSockets: unavailable("Codex has no setting that refuses Unix sockets to its commands"),
			ProcessInspection: unavailable("Codex's Seatbelt sandbox has no setting that hides the other " +
				"processes of the same user"),
			InstallWrites: native("the workspace-write Seatbelt sandbox: writes only in the work folder " +
				"and the thread's writable roots"),
		},
	}
}
