package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"os"

	"journal-agent/host"
)

// protection prints which items of a program's protected arrangement this host can enforce, and why any is missing.
// A contained host asks about the agent image on the agent daemon, where its tools run.
func protection(arguments []string) error {
	flags := flag.NewFlagSet("protection", flag.ContinueOnError)
	driver := flags.String("driver", "", "the agent driver: claude or codex")
	build := flags.String("build", "", "the pinned build the arrangement is for")
	stateFolder := flags.String("state", host.DefaultStateFolder(), "the host's private state folder")
	arrangementFlag := flags.String("arrangement", string(host.Local), "where agents run: local, contained or local-project")
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
	if arrangement == host.LocalProject {
		return localProjectProtection()
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
	capability, err := host.InspectProtection(platform, *driver, *build, host.NativeEvidence{Folder: *stateFolder})
	if err != nil {
		return err
	}
	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")
	return encoder.Encode(capability)
}

// localProjectProtection starts this program as the probe under the local-project confinement and prints what held;
// a machine with no confining mechanism is refused by name.
func localProjectProtection() error {
	program, err := os.Executable()
	if err != nil {
		return err
	}
	report, err := host.ProbeLocalProjectProtection([]string{program, "protection-probe"})
	if err != nil {
		return err
	}
	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")
	return encoder.Encode(report)
}

// protectionProbe is the program the local-project probe starts under the confinement: it tries one action.
func protectionProbe(arguments []string) error {
	if len(arguments) != 2 {
		return fmt.Errorf("usage: journal-agent protection-probe write|read|connect <path>")
	}
	return host.RunProtectionProbe(arguments[0], arguments[1])
}
