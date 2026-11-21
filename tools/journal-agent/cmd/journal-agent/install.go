package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"

	"journal-agent/host"
)

// install publishes a protected installation from a manifest of artifact sources and their SHA-256 digests.
func install(arguments []string) error {
	flags := flag.NewFlagSet("install", flag.ContinueOnError)
	manifestPath := flags.String("manifest", "", "the JSON manifest of artifacts: name, source, sha256, executable")
	folder := flags.String("into", "", "the absolute installation folder; it must not exist yet")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	content, err := os.ReadFile(*manifestPath)
	if err != nil {
		return err
	}
	var manifest host.InstallationManifest
	if err := json.Unmarshal(content, &manifest); err != nil {
		return err
	}
	if err := host.Install(manifest, *folder); err != nil {
		return err
	}
	return installation([]string{"--folder", *folder})
}

// installation prints each verified artifact of a protected installation, or why it is refused.
func installation(arguments []string) error {
	flags := flag.NewFlagSet("installation", flag.ContinueOnError)
	folder := flags.String("folder", "", "the installation folder")
	arrangementFlag := flags.String("arrangement", string(host.Local), "where agents run: local or contained")
	agentImage := flags.String("agent-image", "", "the agent image a contained host runs, by digest")
	runnerImage := flags.String("runner-image", "", "the sign-in runner image of a contained host, by digest")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	arrangement, err := host.ParseArrangement(*arrangementFlag)
	if err != nil {
		return err
	}
	if arrangement.IsContained() {
		fmt.Println(host.PinnedImages{Agent: *agentImage, Runner: *runnerImage}.Lines(arrangement))
		return nil
	}
	verified, err := host.Installation{Folder: *folder}.Verify()
	if err != nil {
		return err
	}
	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")
	return encoder.Encode(verified)
}

// verifyInstallation refuses to serve from a protected installation that changed or can be changed. Without one,
// the host serves only what needs no saved account.
func verifyInstallation(folder string) error {
	if folder == "" {
		log.Print("no protected installation: saved-account starts are refused on this host")
		return nil
	}
	verified, err := host.Installation{Folder: folder}.Verify()
	if err != nil {
		return err
	}
	log.Printf("protected installation %s verified: %d artifacts", folder, len(verified))
	return nil
}
