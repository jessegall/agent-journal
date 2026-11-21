package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"
	"os"
	"runtime"
	"time"

	"journal-agent/release"
)

// installRelease installs this machine's target of a journal's release into a sealed folder, verifying the manifest
// the first-stage script downloaded with the key this program pins.
func installRelease(arguments []string) error {
	flags := flag.NewFlagSet("install-release", flag.ContinueOnError)
	origin := flags.String("origin", "", "the journal's canonical https origin")
	manifestPath := flags.String("manifest", "", "the release manifest the installer downloaded")
	signaturePath := flags.String("signature", "", "the manifest's detached signature")
	folder := flags.String("into", "", "the absolute installation folder")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	if *origin == "" || *manifestPath == "" || *signaturePath == "" || *folder == "" {
		return fmt.Errorf("usage: journal-agent install-release --origin <url> --manifest <file> --signature <file> --into <folder>")
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

	installer := release.Installer{
		Origin:    *origin,
		Target:    release.Target{OS: runtime.GOOS, Arch: runtime.GOARCH},
		Transport: &http.Client{Timeout: 5 * time.Minute},
		PublicKey: key,
	}

	return installer.Install(context.Background(), manifest, signature, *folder)
}
