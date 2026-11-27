package main

import (
	"errors"
	"fmt"
	"io"
	"os"
	"slices"
	"time"

	"journal-runner/device"
	"journal-runner/hostapi"
	"journal-runner/localsession"
	"journal-runner/project"
	"journal-runner/userservice"
)

// errNotQuiet stops a disconnect whose relay or one of its children may still write.
var errNotQuiet = errors.New("this folder's work has not stopped, so nothing of it was removed")

// relayStopCheck is how often a disconnect looks whether the fenced relay let go of its lock.
const relayStopCheck = 250 * time.Millisecond

// disconnectRequest is what journal disconnect was asked: confirmed with --yes and the binding of a disconnect to
// finish with --resume.
type disconnectRequest struct {
	confirmed bool
	resume    string
}

func disconnectRequestOf(flags []string) disconnectRequest {
	request := disconnectRequest{
		confirmed: slices.Contains(flags, "--yes"),
	}
	if at := slices.Index(flags, "--resume"); at >= 0 && at+1 < len(flags) {
		request.resume = flags[at+1]
	}

	return request
}

// disconnect removes this folder's connection from this machine once confirmed. It runs before any relay is woken,
// writes its cleanup record before removing anything and goes through the steps in order; one cut short is finished
// by journal disconnect --resume <binding> from the record alone, with no connection.json and no network.
func (commands dispatcher) disconnect(flags []string, folder string, stdout, stderr io.Writer) int {
	request := disconnectRequestOf(flags)
	if request.resume != "" {
		record, err := device.DisconnectOf(commands.stateFolder, request.resume)
		if errors.Is(err, device.ErrNoDisconnect) {
			fmt.Fprintln(stdout, "No disconnect of "+request.resume+" is left to finish.")
			return 1
		}
		if err != nil {
			fmt.Fprintln(stderr, "journal:", err)
			return 1
		}

		return commands.finishDisconnect(record, request, stdout, stderr)
	}

	found, binding, _, err := commands.connected(folder)
	if errors.Is(err, project.ErrNotConnected) {
		fmt.Fprintln(stdout, "Not connected: no connected project folder holds "+folder+".")
		return 0
	}
	if err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}
	record, err := device.DisconnectOf(commands.stateFolder, binding.BindingID)
	if err == nil {
		return commands.finishDisconnect(record, request, stdout, stderr)
	}
	if !errors.Is(err, device.ErrNoDisconnect) {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}
	if !request.confirmed {
		fmt.Fprintln(stdout, "This disconnects "+found.Root+" from "+binding.JournalURL+
			": its relay stops and this machine forgets its sign-in. Work in progress is kept. Run journal disconnect --yes to go on.")
		return 1
	}

	record = device.DisconnectRecord{
		BindingID: binding.BindingID, RootID: binding.RootID, CanonicalRoot: found.Root, JournalURL: binding.JournalURL,
		Service: userservice.Service{BindingID: binding.BindingID}.Label(), Done: []device.DisconnectStep{},
	}
	if err := record.Save(commands.stateFolder); err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}

	return commands.finishDisconnect(record, request, stdout, stderr)
}

// finishDisconnect runs the record's remaining steps in order, saving the record after each, and finishes the record
// last. Every run prints the step it stopped at and whether the server was contacted.
func (commands dispatcher) finishDisconnect(
	record device.DisconnectRecord,
	request disconnectRequest,
	stdout, stderr io.Writer,
) int {
	resumeLine := "If this stops before it ends, finish it with " + commands.commandPath + " disconnect --resume " +
		record.BindingID + "; it needs no network."
	fmt.Fprintln(stdout, resumeLine)
	contacted := false
	for _, step := range record.Remaining() {
		err := commands.disconnectStep(step, record, request, &contacted, stdout)
		if err == nil {
			record.Done = append(record.Done, step)
			err = record.Save(commands.stateFolder)
		}
		if err != nil {
			fmt.Fprintln(stderr, "journal: the disconnect stopped at the step to "+string(step)+": "+err.Error())
			fmt.Fprintln(stdout, resumeLine)
			printRevocation(contacted, stdout)
			return 1
		}
	}
	if err := record.Finish(commands.stateFolder); err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}

	fmt.Fprintln(stdout, "Disconnected "+record.CanonicalRoot+".")
	printRevocation(contacted, stdout)
	if device.RemainingBindings(commands.stateFolder) > 0 {
		return 0
	}

	undo, err := device.MachineChanges{StateFolder: commands.stateFolder}.Undo()
	if err != nil {
		fmt.Fprintln(stderr, "journal:", err)
		return 1
	}
	printMachineUndo(undo, stdout)

	return 0
}

// disconnectStep runs one step of the disconnect.
func (commands dispatcher) disconnectStep(
	step device.DisconnectStep,
	record device.DisconnectRecord,
	request disconnectRequest,
	contacted *bool,
	stdout io.Writer,
) error {
	state := record.Connection(commands.stateFolder)
	switch step {
	case device.StepFence:
		return state.Fence()
	case device.StepService:
		return commands.disableOwnedService(record)
	case device.StepRelay:
		return commands.awaitQuiet(record)
	case device.StepSignIns:
		kept := localsession.KeptFiles{StateFolder: commands.stateFolder, BindingID: record.BindingID}

		return errors.Join(kept.Forget(), state.RemoveSignIns())
	default:
		return errors.Join(
			commands.forgetIgnoreRule(record, stdout),
			project.Folder{Root: record.CanonicalRoot}.Disconnect(),
			state.Remove(),
			os.RemoveAll(device.RelayFolder(commands.stateFolder, record.BindingID)),
		)
	}
}

// forgetIgnoreRule takes out the .journal/ line setup added to .gitignore and says so, unless it changed since setup
// added it.
func (commands dispatcher) forgetIgnoreRule(record device.DisconnectRecord, stdout io.Writer) error {
	removed, err := project.Folder{Root: record.CanonicalRoot}.ForgetIgnoreRule()
	if err != nil || !removed {
		return err
	}
	fmt.Fprintln(stdout, "Removed the .journal/ line setup added to .gitignore.")

	return nil
}

// disableOwnedService disables the service the record owns; a machine with no service manager has none to disable.
func (commands dispatcher) disableOwnedService(record device.DisconnectRecord) error {
	err := commands.disableService(record.BindingID)
	if err == nil || errors.Is(err, userservice.ErrNoServiceManager) {
		return nil
	}

	return fmt.Errorf("the service %s could not be disabled, so it and the sign-in stay for a retry: %w", record.Service, err)
}

// awaitQuiet waits for the fenced relay to let go of its lock, which it does only once serving ended, and then proves
// that no child it started still runs; a relay or child that does not stop keeps everything as it is.
func (commands dispatcher) awaitQuiet(record device.DisconnectRecord) error {
	state := record.Connection(commands.stateFolder)
	deadline := time.Now().Add(commands.relayStopWait)
	for state.RelayIsRunning() {
		if time.Now().After(deadline) {
			return fmt.Errorf("%w: the relay still runs as process %d", errNotQuiet, state.RelayHolder())
		}
		time.Sleep(relayStopCheck)
	}
	live, err := hostapi.LiveKeptProcesses(device.RelayFolder(commands.stateFolder, record.BindingID))
	if err != nil {
		return fmt.Errorf("%w: the status of its processes is unknown: %v", errNotQuiet, err)
	}
	if len(live) > 0 {
		return fmt.Errorf("%w: process %s of the journal still runs, or the system cannot say it ended",
			errNotQuiet, live[0])
	}

	return nil
}

// printMachineUndo names what the last removal did with the setup every connected folder shared: the releases, the
// PATH lines and the journal link it removed, and those it kept because they changed since.
func printMachineUndo(undo device.MachineUndo, stdout io.Writer) {
	fmt.Fprintln(stdout, "No connected project is left on this machine, so the setup they shared is removed:")
	fmt.Fprintln(stdout, "  Removed the shared journal releases at "+undo.Releases)
	for _, change := range undo.Removed {
		fmt.Fprintln(stdout, "  Removed "+machineChangeText(change))
	}
	for _, change := range undo.Kept {
		fmt.Fprintln(stdout, "  Kept "+machineChangeText(change)+": it changed since the journal set it up, so it is yours to "+
			"remove.")
	}
}

func machineChangeText(change device.MachineChange) string {
	if change.Kind == device.ChangeLink {
		return "the journal command link " + change.Path
	}

	return "the journal's PATH lines in " + change.Path
}

// printRevocation says so when the disconnect never reached the journal, so the binding may still read connected there.
func printRevocation(contacted bool, stdout io.Writer) {
	if !contacted {
		fmt.Fprintln(stdout, "Server revocation was not checked.")
	}
}
