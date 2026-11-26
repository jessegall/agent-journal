// Command journal-release builds the remote-project installation for every release target and signs the manifest
// of what it built.
package main

import (
	"flag"
	"fmt"
	"os"
	"os/exec"
	"strings"

	"journal-agent/release"
)

func main() {
	if err := run(os.Args[1:]); err != nil {
		fmt.Fprintln(os.Stderr, "journal-release:", err)
		os.Exit(1)
	}
}

// run reads the private key only from the file its flag names, never from an argument value or the environment.
func run(arguments []string) error {
	flags := flag.NewFlagSet("journal-release", flag.ContinueOnError)
	version := flags.String("version", "", "the version of the release")
	keyPath := flags.String("signing-key", "", "the file, outside the repository, holding the ed25519 private key")
	folder := flags.String("out", "", "the new folder the release is written into")
	module := flags.String("module", ".", "the journal-agent module folder")
	if err := flags.Parse(arguments); err != nil {
		return err
	}

	if *version == "" || *keyPath == "" || *folder == "" {
		return fmt.Errorf("usage: journal-release --version <version> --signing-key <file> --out <folder> [--module <folder>]")
	}

	repository, err := repositoryOf(*module)
	if err != nil {
		return err
	}

	key, err := release.ReadSigningKey(*keyPath, repository)
	if err != nil {
		return err
	}

	profile := release.RemoteProject

	sources := release.Sources{Repository: repository, Module: *module}
	manifest, err := release.Build(profile, sources, *folder, *version, key)
	if err != nil {
		return err
	}

	fmt.Printf("release %s: %d targets, signed manifest in %s\n", manifest.Version, len(manifest.Targets), *folder)

	return nil
}

// repositoryOf is the top folder of the Git repository the module lies in.
func repositoryOf(module string) (string, error) {
	printed, err := exec.Command("git", "-C", module, "rev-parse", "--show-toplevel").Output()
	if err != nil {
		return "", fmt.Errorf("finding the repository of %s failed: %w", module, err)
	}

	return strings.TrimSpace(string(printed)), nil
}
