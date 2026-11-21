package main

import (
	"context"
	"encoding/json"
	"flag"
	"os"

	"journal-agent/host"
)

// protection prints which items of a program's protected arrangement this host can enforce, and why any is missing.
// A contained host asks about the agent image on the agent daemon, where its tools run.
func protection(arguments []string) error {
	flags := flag.NewFlagSet("protection", flag.ContinueOnError)
	program := flags.String("program", "", "the agent program: claude or codex")
	build := flags.String("build", "", "the pinned build the arrangement is for")
	stateFolder := flags.String("state", defaultStateFolder(), "the host's private state folder")
	arrangementFlag := flags.String("arrangement", string(host.Local), "where agents run: local or contained")
	dockerSocket := flags.String("docker", "", "the agent daemon's socket a contained host starts containers through")
	installationName := flags.String("installation-name", "", "the prefix of a contained host's containers")
	agentImage := flags.String("agent-image", "", "the agent image a contained host runs, by digest")
	seccomp := flags.String("seccomp-profile", "", "the seccomp profile agent containers run under")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	arrangement, err := host.ParseArrangement(*arrangementFlag)
	if err != nil {
		return err
	}
	platform := host.LocalPlatform()
	if arrangement.IsContained() {
		installation, err := host.ParseInstallationName(*installationName)
		if err != nil {
			return err
		}
		if err := arrangement.AssertServable(*dockerSocket, installation); err != nil {
			return err
		}
		rules := host.ContainerRules{Arrangement: arrangement, InstallationName: installation, AgentImage: *agentImage}
		containers := host.Containers{Docker: "docker", Host: *dockerSocket, Rules: rules}
		platform = host.ContainedPlatform(context.Background(), containers, *seccomp)
	}
	capability, err := host.InspectProtection(platform, *program, *build, host.NativeEvidence{Folder: *stateFolder})
	if err != nil {
		return err
	}
	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")
	return encoder.Encode(capability)
}
