package main

import (
	"context"
	"errors"
	"fmt"
	"io"

	"journal-agent/client"
	"journal-agent/device"
)

// errNothingStaged is returned when a folder holds no staged install to resume or abandon.
var errNothingStaged = errors.New("this folder holds no staged install: run the install line to connect it")

// errNotCommitted is returned when the journal holds no connection of the staged install: its line was never spent.
var errNotCommitted = errors.New(
	"the journal holds no connection of this install: run the install line again while it is valid, or copy a new one",
)

// errCommitted refuses to abandon an install the journal already committed.
var errCommitted = errors.New(
	"the journal already connected this folder: finish the install with journal-agent connect --resume, or run journal disconnect",
)

// resume finishes a staged install without its ticket: the binding kept already, or the one the journal committed
// for the staged credential and nonce, recovered through the recover route. A staged install the journal never
// committed asks for a line again; an outcome the journal did not answer keeps the staged install as it is.
func (connection projectConnection) resume(ctx context.Context) (device.Binding, error) {
	unlock, err := connection.state.Lock()
	if err != nil {
		return device.Binding{}, err
	}
	defer unlock()

	if binding, err := connection.state.Binding(); err == nil {
		return binding, nil
	}
	pending, err := connection.state.Staged()
	if errors.Is(err, device.ErrNotConnected) {
		return device.Binding{}, errNothingStaged
	}
	if err != nil {
		return device.Binding{}, err
	}

	redemption, err := connection.committedRedemption(ctx, pending)
	if err != nil {
		return device.Binding{}, err
	}

	return connection.keep(redemption, pending)
}

// abandon removes a staged install the journal never committed. One it committed is refused and pointed at resume or
// disconnect, and one whose outcome the journal did not answer is kept.
func (connection projectConnection) abandon(ctx context.Context, out io.Writer) error {
	unlock, err := connection.state.Lock()
	if err != nil {
		return err
	}
	defer unlock()

	if _, err := connection.state.Binding(); err == nil {
		return errCommitted
	}
	pending, err := connection.state.Staged()
	if errors.Is(err, device.ErrNotConnected) {
		return errNothingStaged
	}
	if err != nil {
		return err
	}

	_, err = connection.committedRedemption(ctx, pending)
	if err == nil {
		return errCommitted
	}
	if !errors.Is(err, errNotCommitted) {
		return err
	}
	if err := connection.state.RemoveStaged(); err != nil {
		return err
	}
	fmt.Fprintln(out, "journal: removed this folder's staged install; nothing was connected.")

	return nil
}

// committedRedemption is the binding the journal committed for the staged credential and nonce. A refusal (the
// recover route answers one generic refusal to a credential or nonce it does not know) means nothing was committed;
// any other failure leaves the outcome unknown.
func (connection projectConnection) committedRedemption(
	ctx context.Context,
	pending device.PendingConnection,
) (client.Redemption, error) {
	enrollment := device.Enrollment{JournalURL: pending.Origin, Secret: pending.HostCredential}
	redemption, err := client.ForRemoteProject(enrollment, connection.transport).Recover(ctx, pending.InstallationNonce)
	if errors.Is(err, client.ErrRefused) {
		return client.Redemption{}, errNotCommitted
	}

	return redemption, err
}
