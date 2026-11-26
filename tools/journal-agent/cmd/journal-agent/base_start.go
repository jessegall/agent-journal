package main

import (
	"journal-agent/client"
	"journal-agent/host"
	"journal-agent/profiles/contracts"
)

// grantedStart is the base of every start of a runtime, built once from what the journal granted: the conversation
// and the model and effort it asked for. A terminal and an app-server runtime, on this machine and in a container, all take
// their start from it, so none of them can leave the model out.
func grantedStart(grant client.Grant, conversationID string) contracts.BaseStart {
	return contracts.BaseStart{
		SessionID: conversationID,
		Model:     grant.Runtime.RequestedModel(),
		Effort:    grant.Runtime.RequestedEffort(),
	}
}

// startOnThisMachine is the granted start of a runtime whose program runs on this machine: its settings folder, the
// folder the grant names to work in, the hook command and its account.
func startOnThisMachine(
	grant client.Grant,
	conversationID, settingsFolder, hookCommand string,
	account *contracts.AccountStart,
) contracts.BaseStart {
	base := grantedStart(grant, conversationID)
	base.SettingsFolder = settingsFolder
	base.WorkFolder = grant.Runtime.Folder
	base.HookCommand = hookCommand
	base.Account = account

	return base
}

// startInContainer is the granted start of a runtime whose program runs in its session's container, protected when
// the container's manifest is; containedProcessOf gives it the container's own folders, hook command and account.
func startInContainer(grant client.Grant, conversationID string, manifest host.ContainerManifest) contracts.BaseStart {
	base := grantedStart(grant, conversationID)
	base.Protected = manifest.IsProtected()

	return base
}
