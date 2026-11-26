package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"
	"os"
	"runtime"
	"time"

	"journal-agent/host"
	"journal-agent/release"
)

// installRelease installs this machine's target of a journal's release into a sealed folder, verifying the manifest
// the first-stage script downloaded with the key this program pins.
func installRelease(arguments []string) error {
	flags := flag.NewFlagSet("install-release", flag.ContinueOnError)
	origin := flags.String("origin", "", "the journal's canonical https origin")
	manifestPath := flags.String("manifest", "", "the release manifest the installer downloaded")
	signaturePath := flags.String("signature", "", "the manifest's detached signature")
	programsPath := flags.String("programs", "", "the journal's list of the programs to seal")
	folder := flags.String("into", "", "the absolute installation folder")
	stateFolder := flags.String("state", host.DefaultStateFolder(), "the host's private state folder the allow list is written to")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	if *origin == "" || *manifestPath == "" || *signaturePath == "" || *programsPath == "" || *folder == "" {
		return fmt.Errorf("usage: journal-agent install-release --origin <url> --manifest <file> --signature <file> " +
			"--programs <file> --into <folder>")
	}

	key, err := release.PinnedPublicKey()
	if err != nil {
		return err
	}
	manifest, err := os.ReadFile(*manifestPath)
	if err != nil {
		return err
	}
	signature, err := os.ReadFile(*signaturePath)
	if err != nil {
		return err
	}
	listed, err := os.ReadFile(*programsPath)
	if err != nil {
		return err
	}
	programs, err := release.ParseProgramList(listed)
	if err != nil {
		return err
	}

	installer := release.Installer{
		Origin:    *origin,
		Target:    release.Target{OS: runtime.GOOS, Arch: runtime.GOARCH},
		Transport: &http.Client{Timeout: 5 * time.Minute},
		PublicKey: key,
		// The official installs of the listed programs are imported from the PATH of the install line's shell.
		ProgramPath: os.Getenv("PATH"),
	}

	if err := installer.Install(context.Background(), manifest, signature, programs, *folder); err != nil {
		return err
	}

	// A rerun with the folder already there writes the list again, from what that installation sealed.
	return release.WriteAllowList(*stateFolder, *folder, programs)
}
