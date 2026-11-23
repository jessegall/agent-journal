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
	Driver    string           `json:"driver"`
	Build     string           `json:"build"`
	Items     []BoundaryResult `json:"items"`
	Available bool             `json:"available"`
}

// AwaitsEvidenceOnly reports whether every item has a native mechanism and all that is missing is the recorded run
// that shows each hold: the state a protected-account trial starts in, to make that run.
func (capability ProtectionCapability) AwaitsEvidenceOnly() bool {
	for _, item := range capability.Items {
		if !item.Enforced && item.Mechanism.Native == "" {
			return false
		}
	}
	return len(capability.Items) > 0
}

// Shortfalls names each item that is not enforced with the reason it is not, for a refusal to say exactly why.
func (capability ProtectionCapability) Shortfalls() []string {
	var shortfalls []string
	for _, item := range capability.Items {
		if !item.Enforced {
			shortfalls = append(shortfalls, string(item.Item)+": "+item.Reason)
		}
	}
	return shortfalls
}

// ErrUnknownDriver is returned for a program the host has no protection specification for.
var ErrUnknownDriver = errors.New("no protection specification for this program")

// NativeEvidence is the evidence the private native procedures recorded on this host: per program, build and
// platform, the identifier of the run that showed each item hold.
type NativeEvidence struct {
	Folder string
}

const evidenceName = "native-evidence.json"

// shown answers the identifier of the run that showed the item hold on the platform kept under that evidence key,
// or "" when none did.
func (evidence NativeEvidence) shown(program, build, platform string, item BoundaryItem) (string, error) {
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
	return records[program+"@"+build+"/"+platform][item], nil
}

// ProtectionPlatform is where a program's tools run: the name a report gives it, the key its evidence is kept under,
// and the mechanisms the pinned clients have there.
type ProtectionPlatform struct {
	Name        string
	EvidenceKey string
	Mechanisms  map[string]DriverMechanisms
}

// LocalPlatform is this host's own operating system, where a local host's tools run.
func LocalPlatform() ProtectionPlatform {
	return ProtectionPlatform{Name: runtime.GOOS, EvidenceKey: runtime.GOOS, Mechanisms: platformMechanisms()}
}

// DriverMechanisms is how one driver's pinned client applies each boundary item on this platform.
type DriverMechanisms map[BoundaryItem]BoundaryMechanism

// InspectProtection reports which items of the program's protected arrangement this host can enforce now, on the
// platform its tools run on.
func InspectProtection(
	platform ProtectionPlatform,
	program, build string,
	evidence NativeEvidence,
) (ProtectionCapability, error) {
	mechanisms, known := platform.Mechanisms[program]
	if !known {
		return ProtectionCapability{}, ErrUnknownDriver
	}
	capability := ProtectionCapability{Platform: platform.Name, Driver: program, Build: build, Available: true}
	for _, item := range BoundaryItems {
		result, err := judgeItem(program, build, platform.EvidenceKey, item, mechanisms[item], evidence)
		if err != nil {
			return ProtectionCapability{}, err
		}
		capability.Items = append(capability.Items, result)
		capability.Available = capability.Available && result.Enforced
	}
	return capability, nil
}

func judgeItem(
	program, build, platform string,
	item BoundaryItem,
	mechanism BoundaryMechanism,
	evidence NativeEvidence,
) (BoundaryResult, error) {
	result := BoundaryResult{Item: item, Mechanism: mechanism}
	if mechanism.Native == "" {
		result.Reason = "no native mechanism: " + mechanism.Missing
		return result, nil
	}
	shown, err := evidence.shown(program, build, platform, item)
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
