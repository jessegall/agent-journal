package main

import (
	"bufio"
	"context"
	"errors"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"

	"journal-agent/client"
	"journal-agent/host"
	"journal-agent/hostapi"
)

// enroll stores the host id and the secret agents:host-enroll printed. The secret is read from standard input or
// from the file --secret-file names, so it never appears in the environment, the process list or the shell history:
// an operator passes the file's path, never the secret. An enrollment already held for the same journal and host is
// kept as it is, so a one-shot service may run enroll on every start.
func enroll(arguments []string) error {
	flags := flag.NewFlagSet("enroll", flag.ContinueOnError)
	journalURL := flags.String("journal", "", "the journal's URL")
	hostID := flags.String("host", "", "the host id agents:host-enroll printed")
	stateFolder := flags.String("state", host.DefaultStateFolder(), "the host's private state folder")
	secretFile := flags.String("secret-file", "", "a file holding the secret, instead of standard input")
	if err := assertDeclaredFlags(flags); err != nil {
		return err
	}
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	if *journalURL == "" || *hostID == "" {
		return errors.New("enroll needs --journal and --host, and the secret on standard input or in --secret-file")
	}
	state := host.State{Folder: *stateFolder}
	trimmedURL := strings.TrimRight(*journalURL, "/")
	secret, err := readSecret(*secretFile)
	if err != nil {
		return err
	}
	enrollment := host.Enrollment{JournalURL: trimmedURL, HostID: *hostID, Secret: secret}
	if state.HoldsEnrollment(enrollment) {
		log.Printf("host %s is already enrolled with %s; nothing changed", *hostID, trimmedURL)
		return nil
	}
	if err := state.Save(enrollment); err != nil {
		return err
	}
	log.Printf("host %s is enrolled; its state is in %s", enrollment.HostID, *stateFolder)
	return nil
}

// readSecret reads the secret from the file, or from standard input when no file is named; a trailing newline is no
// part of it.
func readSecret(secretFile string) (string, error) {
	if secretFile != "" {
		content, err := os.ReadFile(secretFile)
		if err != nil {
			return "", fmt.Errorf("enroll reads the secret from %s: %w", secretFile, err)
		}
		return strings.TrimSpace(string(content)), nil
	}
	secret, err := bufio.NewReader(os.Stdin).ReadString('\n')
	if err != nil && secret == "" {
		return "", errors.New("enroll reads the secret from standard input or --secret-file")
	}
	return strings.TrimSpace(secret), nil
}

// verifyArrangement checks what the host runs from before it enrolls, listens or claims anything: a contained host's
// pinned images on the agent daemon, a local host's sealed installation folder.
func verifyArrangement(arrangement host.Arrangement, pinned host.PinnedImages, dockerSocket, installationFolder string) error {
	if !arrangement.IsContained() {
		return verifyInstallation(installationFolder)
	}

	containers, err := host.ContainersOn(dockerSocket, host.ContainerRules{})
	if err != nil {
		return err
	}

	return pinned.AssertLoaded(context.Background(), containers)
}

// serve carries out the instructions the journal sends this host until it is stopped: host protocol 1 opens, feeds and
// ends every process the journal decides on, locally or in a container of the agent daemon, and the start socket
// answers the sign-in service's account-folder calls.
func serve(arguments []string) error {
	flags := flag.NewFlagSet("serve", flag.ContinueOnError)
	stateFolder := flags.String("state", host.DefaultStateFolder(), "the host's private state folder")
	hookCommand := flags.String("hook-command", "", "the hook relay command the programs call")
	installationFolder := flags.String("installation", "", "the protected installation saved-account starts run from")
	arrangementFlag := flags.String("arrangement", string(host.Local), "where agents run: local or contained")
	dockerSocket := flags.String("docker", "", "the agent daemon's socket a contained host starts containers through")
	installationName := flags.String("installation-name", "", "the prefix of a contained host's containers")
	agentImage := flags.String("agent-image", "", "the agent image a contained host runs, by digest")
	runnerImage := flags.String("runner-image", "", "the sign-in runner image of a contained host, by digest")
	developmentPrograms := flags.String("development-programs", os.Getenv("JOURNAL_DEVELOPMENT_PROGRAMS"),
		"local development only: a daemon folder of the checkout's builds of the image's programs, mounted over them")
	if err := assertDeclaredFlags(flags); err != nil {
		return err
	}
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	arrangement, err := host.ParseArrangement(*arrangementFlag)
	if err != nil {
		return err
	}
	installation, err := host.ParseInstallationName(*installationName)
	if err != nil {
		return err
	}
	if err := arrangement.AssertServable(*dockerSocket, installation); err != nil {
		return err
	}
	pinned := host.PinnedImages{Agent: *agentImage, Runner: *runnerImage}
	if err := verifyArrangement(arrangement, pinned, *dockerSocket, *installationFolder); err != nil {
		return err
	}
	enrollment, err := (host.State{Folder: *stateFolder}).Load()
	if err != nil {
		return err
	}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	journal := client.New(enrollment).WithArrangement(string(arrangement))
	containers := host.Containers{}
	if arrangement.IsContained() {
		rules := host.ContainerRules{Arrangement: arrangement, InstallationName: installation, AgentImage: *agentImage,
			Allowed: host.NewAllowedImages(), DevelopmentPrograms: *developmentPrograms}
		containers, err = host.ContainersOn(*dockerSocket, rules)
		if err != nil {
			return err
		}
	}
	release := "development"
	if *installationFolder != "" {
		release = filepath.Base(*installationFolder)
	}
	if err := hostapi.CheckOrigin(journal.JournalURL(), arrangement.IsContained()); err != nil {
		return err
	}
	if _, err := startHostProtocol(ctx, journal, enrollment, *stateFolder,
		hostNamesOf(journal, *installationFolder, *hookCommand), containers, release, hostProtocolOptions{}); err != nil {
		return err
	}
	<-ctx.Done()
	return nil
}
