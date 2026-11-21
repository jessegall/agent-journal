package host

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"path/filepath"

	"journal-agent/client"
	"journal-agent/profiles/contracts"
)

// StartJournal is what preparing a start asks the journal: the runtime's one-use grant and its account claim.
type StartJournal interface {
	OutputGrantSource
	StartGrant(ctx context.Context, runtimeID string) (client.Grant, error)
	ClaimStart(ctx context.Context, sessionID string) (client.ClaimedStart, error)
}

// PreparedStart is a runtime's start once the host holds both its committed grant and its saved-account claim and
// every prerequisite held: the only thing a driver may be opened from.
type PreparedStart struct {
	Grant client.Grant
	Claim client.ClaimedStart
}

// ProgramBuild is the build of the program the grant starts.
func (prepared PreparedStart) ProgramBuild() string {
	return prepared.Grant.ProgramBuild()
}

func (prepared PreparedStart) Runtime() client.RuntimeStart {
	return prepared.Grant.Runtime
}

func (prepared PreparedStart) Transport() contracts.TransportProfile {
	recipe := prepared.Claim.Recipe
	return contracts.TransportProfile(recipe.TransportProfile)
}

func (prepared PreparedStart) AccountStart(server *contracts.JournalServer, reference string) *contracts.AccountStart {
	claim := prepared.Claim
	return &contracts.AccountStart{
		Folder:          claim.Directory,
		Protection:      claim.Recipe.ProtectionSettings,
		Transport:       prepared.Transport(),
		JournalServer:   server,
		LaunchReference: reference,
	}
}

// ContainerManifest is the manifest of the container the start's session runs in, which the journal compiled; a start
// on the protected host has none.
func (prepared PreparedStart) ContainerManifest() (ContainerManifest, bool, error) {
	if !prepared.Grant.NamesContainer() {
		return ContainerManifest{}, false, nil
	}

	var manifest ContainerManifest
	if err := json.Unmarshal(prepared.Grant.Container, &manifest); err != nil {
		return ContainerManifest{}, false, fmt.Errorf("the start grant's container manifest is unreadable: %w", err)
	}

	return manifest, true, nil
}

// RelayVariables tell the program's hook relay the start's key and where its sealed output grants are.
func (prepared PreparedStart) RelayVariables(runtimeFolder string) []string {
	return []string{
		"JOURNAL_START_KEY=" + prepared.Claim.StartKey,
		"JOURNAL_OUTPUT_GRANTS=" + filepath.Join(runtimeFolder, OutputGrantsName),
	}
}

// StartPrerequisites refuses a start the host cannot run protected, such as one with no verified installation or
// whose arrangement the host has not proven.
type StartPrerequisites func(grant client.Grant, claim client.ClaimedStart) error

// StartPreparation takes a runtime from its grant to a prepared start, saving each stage before the next step.
type StartPreparation struct {
	Journal       StartJournal
	States        StartStates
	Prerequisites StartPrerequisites
	// RuntimesFolder holds each runtime's folder, where its sealed output grants are refreshed before release.
	RuntimesFolder string
}

// ErrClaimUncertain is returned for a runtime whose account claim may have been taken while its answer was lost:
// the host neither claims again nor starts anything until reconciliation settles it.
var ErrClaimUncertain = errors.New("the account claim of this runtime may have been taken; reconciliation decides")

// ErrAlreadyReleased is returned for a runtime whose program may already run: it is proven or reconciled, never
// prepared again.
var ErrAlreadyReleased = errors.New("this runtime's program may already run")

// Prepare gives the runtime's prepared start. A grant or claim saved by an earlier attempt is used again; a refused
// claim keeps the grant and starts nothing.
func (preparation StartPreparation) Prepare(ctx context.Context, runtimeID string) (PreparedStart, error) {
	record, found, err := preparation.States.Load(runtimeID)
	if err != nil {
		return PreparedStart{}, err
	}
	if !found {
		if record, err = preparation.holdGrant(ctx, runtimeID); err != nil {
			return PreparedStart{}, err
		}
	}
	switch record.Recovery() {
	case ReconcileClaim:
		return PreparedStart{}, ErrClaimUncertain
	case ContinuePreparing:
	default:
		return PreparedStart{}, ErrAlreadyReleased
	}
	if record.Claim == nil {
		if record, err = preparation.claim(ctx, record); err != nil {
			return PreparedStart{}, err
		}
	}
	if err := preparation.Prerequisites(record.Grant, *record.Claim); err != nil {
		return PreparedStart{}, fmt.Errorf("runtime %s is not started: %w", runtimeID, err)
	}
	runtimeFolder := filepath.Join(preparation.RuntimesFolder, runtimeID)
	if err := RefreshOutputGrants(ctx, preparation.Journal, record.Claim.StartKey, runtimeFolder); err != nil {
		return PreparedStart{}, fmt.Errorf("runtime %s is not started without its output grants: %w", runtimeID, err)
	}
	record.Stage = Prepared
	if err := preparation.States.Save(record); err != nil {
		return PreparedStart{}, err
	}
	return PreparedStart{Grant: record.Grant, Claim: *record.Claim}, nil
}

func (preparation StartPreparation) holdGrant(ctx context.Context, runtimeID string) (StartRecord, error) {
	grant, err := preparation.Journal.StartGrant(ctx, runtimeID)
	if err != nil {
		return StartRecord{}, err
	}
	record := StartRecord{
		RuntimeID:         runtimeID,
		SessionID:         grant.Runtime.SessionID,
		ProcessGeneration: grant.Runtime.ProcessGeneration,
		Stage:             GrantHeld,
		Grant:             grant,
	}
	return record, preparation.States.Save(record)
}

func (preparation StartPreparation) claim(ctx context.Context, record StartRecord) (StartRecord, error) {
	record.Stage = ClaimRequested
	if err := preparation.States.Save(record); err != nil {
		return StartRecord{}, err
	}
	claimed, err := preparation.Journal.ClaimStart(ctx, record.SessionID)
	if errors.Is(err, client.ErrUncertain) {
		return StartRecord{}, errors.Join(ErrClaimUncertain, err)
	}
	if err != nil {
		record.Stage = GrantHeld
		return StartRecord{}, errors.Join(err, preparation.States.Save(record))
	}
	record.Claim = &claimed
	record.Stage = ClaimHeld
	return record, preparation.States.Save(record)
}
