package main

import (
	"context"
	"encoding/base64"
	"errors"
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"syscall"
	"time"

	"journal-runner/device"
	"journal-runner/hostapi"
	"journal-runner/release"
	"journal-runner/upgrade"
	"journal-runner/userservice"
)

const (
	// upgradeAnswerGrace is how long the relay keeps serving after it answered an upgrade, so the answer reaches
	// the journal before the relay lets go of its lock.
	upgradeAnswerGrace = 2 * time.Second
	// upgradeReadyWithin is how long the new release's relay has to report ready before the binding switches back.
	upgradeReadyWithin = time.Minute
	// upgradePoll is how often the upgrade step looks for the relay lock and the new relay's report.
	upgradePoll = 250 * time.Millisecond
)

// bindingUpgrade carries out the journal's upgrade instruction for this binding: refused while a process lives, the release
// verified and installed beside the running one, answered, and then handed to a detached upgrade step once the relay
// let go of its lock. live answers the live processes; stop ends the relay's run.
type bindingUpgrade struct {
	binder bindingRelay
	live   func() []string
	stop   func()
}

// Upgrade installs the release the plan names and hands the binding to it once the answer went out.
func (upgrade bindingUpgrade) Upgrade(ctx context.Context, _ hostapi.Instruction, plan hostapi.UpgradePlan) (hostapi.UpgradeStarted, error) {
	if running := upgrade.live(); len(running) > 0 {
		return hostapi.UpgradeStarted{}, hostapi.RefusalError{Refusal: hostapi.Fenced, Reason: "a process still runs on this host"}
	}
	if plan.Version == "" {
		return hostapi.UpgradeStarted{}, hostapi.RefusalError{Refusal: hostapi.Unsafe, Reason: "the upgrade instruction names no release"}
	}
	folder, err := upgrade.binder.installUpgrade(ctx, plan)
	if err != nil {
		return hostapi.UpgradeStarted{}, err
	}
	time.AfterFunc(upgradeAnswerGrace, func() {
		if err := upgrade.binder.startUpgradeStep(folder); err != nil {
			fmt.Fprintf(os.Stderr, "the upgrade step did not start: %v\n", err)
			return
		}
		upgrade.stop()
	})

	return hostapi.UpgradeStarted{Release: plan.Version}, nil
}

// installUpgrade verifies the release with the pinned key and installs it beside the running installation.
func (binder bindingRelay) installUpgrade(ctx context.Context, plan hostapi.UpgradePlan) (string, error) {
	signature, err := base64.StdEncoding.DecodeString(plan.Signature)
	if err != nil {
		return "", hostapi.RefusalError{Refusal: hostapi.Unsafe, Reason: "the upgrade's signature does not read"}
	}
	programs, err := release.ParseProgramList([]byte(plan.Drivers))
	if err != nil {
		return "", hostapi.RefusalError{Refusal: hostapi.Unsafe, Reason: err.Error()}
	}
	key, err := release.PinnedPublicKey()
	if err != nil {
		return "", err
	}
	installer := release.Installer{
		Origin:      binder.binding.Enrollment.JournalURL,
		Target:      release.Target{OS: runtime.GOOS, Arch: runtime.GOARCH},
		Transport:   &http.Client{Timeout: 5 * time.Minute},
		PublicKey:   key,
		ProgramPath: os.Getenv("PATH"),
	}
	// The running installation sits in <root>/releases; the new one goes beside it, named for its version and list.
	folder := release.InstallationFolder(filepath.Dir(filepath.Dir(binder.installation.Folder)), plan.Version,
		[]byte(plan.Drivers))
	if err := installer.Install(ctx, []byte(plan.Manifest), signature, programs, folder); err != nil {
		return "", err
	}
	if err := release.WriteAllowList(binder.state.Folder, folder, programs); err != nil {
		return "", err
	}

	return folder, nil
}

// startUpgradeStep starts the detached step that switches the binding to the new release once this relay let go.
func (binder bindingRelay) startUpgradeStep(folder string) error {
	program, err := os.Executable()
	if err != nil {
		return err
	}
	command := exec.Command(program, "upgrade-binding", "--state", binder.state.Folder, "--binding",
		binder.binding.BindingID, "--release", folder, "--previous", binder.installation.Folder)
	command.SysProcAttr = &syscall.SysProcAttr{Setsid: true}
	if err := command.Start(); err != nil {
		return err
	}

	return command.Process.Release()
}

// upgradeBinding switches one binding to an installed release: under the relay lock its pointer moves, the new
// release's relay starts and must report ready, and on a failed readiness the pointer moves back and the previous
// release's relay starts again.
func upgradeBinding(arguments []string) error {
	flags := flag.NewFlagSet("upgrade-binding", flag.ContinueOnError)
	stateFolder := flags.String("state", device.DefaultStateFolder(), "the host's private state folder")
	bindingID := flags.String("binding", "", "the binding to switch")
	newRelease := flags.String("release", "", "the installed release folder to switch to")
	previous := flags.String("previous", "", "the release folder the binding runs from now")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	state, _, err := device.ConnectionOfBinding(*stateFolder, *bindingID)
	if err != nil {
		return err
	}
	switched := time.Now()
	err = upgrade.Binding{State: state}.Upgrade(*newRelease, upgrade.Steps{
		Install:      func(string) error { return nil },
		LiveRuntimes: func() int { return 0 },
		StartRelay: func(installation string) error {
			return device.StartRelay(filepath.Join(installation, "bin", "journal-runner"), *stateFolder, *bindingID)
		},
		AwaitReady:   func(within time.Duration) bool { return awaitReadyRelay(state, switched, within) },
		ReadyWithin:  upgradeReadyWithin,
		PollInterval: upgradePoll,
	})
	if err != nil {
		return restartPrevious(*previous, *stateFolder, *bindingID, err)
	}

	return repointService(*stateFolder, *bindingID, *newRelease, *previous)
}

// repointService points the binding's user service, when one is enabled, at the release it switched to.
func repointService(stateFolder, bindingID, newRelease, previous string) error {
	if previous == "" {
		return nil
	}
	home, err := os.UserHomeDir()
	if err != nil {
		return err
	}
	service := userservice.Service{Home: home, BindingID: bindingID, StateFolder: stateFolder,
		Program: filepath.Join(newRelease, "bin", "journal-runner")}
	err = service.Replace(filepath.Join(previous, "bin", "journal-runner"))
	if errors.Is(err, userservice.ErrNoServiceManager) {
		return nil
	}

	return err
}

// awaitReadyRelay waits for a ready presence report the relay acknowledged after the switch.
func awaitReadyRelay(state device.ConnectionState, since time.Time, within time.Duration) bool {
	deadline := time.Now().Add(within)
	for time.Now().Before(deadline) {
		report, err := state.RelayReport()
		if err == nil && report.ReportedAt.After(since) && report.Readiness == "ready" {
			return true
		}
		time.Sleep(upgradePoll)
	}

	return false
}

// restartPrevious starts the previous release's relay again after a failed switch, and answers why it switched back.
func restartPrevious(previous, stateFolder, bindingID string, cause error) error {
	if previous == "" {
		return cause
	}
	if err := device.StartRelay(filepath.Join(previous, "bin", "journal-runner"), stateFolder, bindingID); err != nil {
		return fmt.Errorf("%w; the previous relay did not start again: %v", cause, err)
	}

	return cause
}
