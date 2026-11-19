package host

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"runtime"
)

// BoundaryItem is one thing a saved account's tools must be kept from, whatever command or file tool they use.
type BoundaryItem string

const (
	AccountSecrets    BoundaryItem = "account-secrets"
	ForeignHistory    BoundaryItem = "foreign-history"
	Keychain          BoundaryItem = "keychain"
	ControlSockets    BoundaryItem = "control-sockets"
	ProcessInspection BoundaryItem = "process-inspection"
	InstallWrites     BoundaryItem = "install-writes"
)

// BoundaryItems is every item a protected arrangement must hold, in the order a report names them.
var BoundaryItems = []BoundaryItem{
	AccountSecrets, ForeignHistory, Keychain, ControlSockets, ProcessInspection, InstallWrites,
}

// BoundaryMechanism is what the pinned client can put between its tool subprocesses and one item, before any tool
// runs: the native setting or operation that applies it, or why nothing can.
type BoundaryMechanism struct {
	Native  string `json:"native,omitempty"`
	Missing string `json:"missing,omitempty"`
}

// BoundaryResult is one item of a capability report: the mechanism, and the native evidence that showed it hold.
type BoundaryResult struct {
	Item      BoundaryItem      `json:"item"`
	Mechanism BoundaryMechanism `json:"mechanism"`
	Evidence  string            `json:"evidence,omitempty"`
	Enforced  bool              `json:"enforced"`
	Reason    string            `json:"reason,omitempty"`
}

// ProtectionCapability says whether this host can enforce a program's protected arrangement on its platform. It is
// available only when every item has a native mechanism and recorded native evidence that it held.
type ProtectionCapability struct {
	Platform  string           `json:"platform"`
	Program   string           `json:"program"`
	Build     string           `json:"build"`
	Items     []BoundaryResult `json:"items"`
	Available bool             `json:"available"`
}

// ErrUnknownProgram is returned for a program the host has no protection specification for.
var ErrUnknownProgram = errors.New("no protection specification for this program")

// NativeEvidence is the evidence the private native procedures recorded on this host: per program, build and
// platform, the identifier of the run that showed each item hold.
type NativeEvidence struct {
	Folder string
}

const evidenceName = "native-evidence.json"

// shown answers the identifier of the run that showed the item hold, or "" when none did.
func (evidence NativeEvidence) shown(program, build string, item BoundaryItem) (string, error) {
	content, err := os.ReadFile(filepath.Join(evidence.Folder, evidenceName))
	if errors.Is(err, os.ErrNotExist) {
		return "", nil
	}
	if err != nil {
		return "", err
	}
	if err := requireOwnerOnly(filepath.Join(evidence.Folder, evidenceName), secretFileMode); err != nil {
		return "", err
	}
	var records map[string]map[BoundaryItem]string
	if err := json.Unmarshal(content, &records); err != nil {
		return "", err
	}
	return records[program+"@"+build+"/"+runtime.GOOS][item], nil
}

// InspectProtection reports which items of the program's protected arrangement this host can enforce now.
func InspectProtection(program, build string, evidence NativeEvidence) (ProtectionCapability, error) {
	mechanisms, known := platformMechanisms()[program]
	if !known {
		return ProtectionCapability{}, ErrUnknownProgram
	}
	capability := ProtectionCapability{Platform: runtime.GOOS, Program: program, Build: build, Available: true}
	for _, item := range BoundaryItems {
		result, err := judgeItem(program, build, item, mechanisms[item], evidence)
		if err != nil {
			return ProtectionCapability{}, err
		}
		capability.Items = append(capability.Items, result)
		capability.Available = capability.Available && result.Enforced
	}
	return capability, nil
}

func judgeItem(
	program, build string,
	item BoundaryItem,
	mechanism BoundaryMechanism,
	evidence NativeEvidence,
) (BoundaryResult, error) {
	result := BoundaryResult{Item: item, Mechanism: mechanism}
	if mechanism.Native == "" {
		result.Reason = "no native mechanism: " + mechanism.Missing
		return result, nil
	}
	shown, err := evidence.shown(program, build, item)
	if err != nil {
		return BoundaryResult{}, err
	}
	if shown == "" {
		result.Reason = "native evidence missing: no recorded run showed it hold on this host"
		return result, nil
	}
	result.Evidence = shown
	result.Enforced = true
	return result, nil
}

// unavailable is the mechanism of an item nothing in the pinned client can enforce on this platform.
func unavailable(why string) BoundaryMechanism { return BoundaryMechanism{Missing: why} }

// native is the mechanism of an item the pinned client applies before its tools run.
func native(how string) BoundaryMechanism { return BoundaryMechanism{Native: how} }
