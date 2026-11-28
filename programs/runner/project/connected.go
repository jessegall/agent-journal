package project

import (
	"errors"
	"fmt"

	"journal-runner/device"
)

var errBeingDisconnected = errors.New("this folder is being disconnected")

// ResolveConnected finds the connected folder at or above the folder, its binding on this machine and its private state, and
// wakes the binding's relay when none runs; a folder a disconnect fenced runs nothing more.
func ResolveConnected(folder, stateFolder string, wake func(device.ConnectionState, string) error) (Folder, device.Binding, device.ConnectionState, error) {
	found, binding, state, err := Connected(folder, stateFolder)
	if err != nil {
		return Folder{}, device.Binding{}, device.ConnectionState{}, err
	}
	if state.IsFenced() {
		return Folder{}, device.Binding{}, device.ConnectionState{}, fmt.Errorf(
			"%w: finish it with journal disconnect --resume %s", errBeingDisconnected, binding.BindingID)
	}

	if !state.RelayIsRunning() {
		if err := wake(state, binding.BindingID); err != nil {
			return Folder{}, device.Binding{}, device.ConnectionState{}, err
		}
	}

	return found, binding, state, nil
}

// Connected finds the connected folder at or above the folder, its binding on this machine and its private state,
// without waking anything.
func Connected(folder, stateFolder string) (Folder, device.Binding, device.ConnectionState, error) {
	found, connection, err := Find(folder)
	if err != nil {
		return Folder{}, device.Binding{}, device.ConnectionState{}, err
	}

	state, binding, err := device.ConnectionOfBinding(stateFolder, connection.BindingID)
	if errors.Is(err, device.ErrNotConnected) {
		return Folder{}, device.Binding{}, device.ConnectionState{}, ErrNotConnected
	}
	if err != nil {
		return Folder{}, device.Binding{}, device.ConnectionState{}, err
	}
	if binding.RootID != connection.RootID {
		return Folder{}, device.Binding{}, device.ConnectionState{}, ErrNotConnected
	}
	if binding.CanonicalRoot != found.Root {
		return Folder{}, device.Binding{}, device.ConnectionState{}, fmt.Errorf(
			"%w: it was connected at %s and is now at %s; connect this folder with a new install line",
			ErrRootMoved, binding.CanonicalRoot, found.Root)
	}

	return found, binding, state, nil
}
