package host

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"testing"
)

func TestAnItemWithoutRecordedEvidenceIsNotEnforced(t *testing.T) {
	capability, err := InspectProtection(LocalPlatform(), "claude", "2.1.323", NativeEvidence{Folder: t.TempDir()})
	if err != nil {
		t.Fatal(err)
	}

	if capability.Available {
		t.Fatal("an arrangement with no native evidence was reported available")
	}
	if len(capability.Items) != len(BoundaryItems) {
		t.Fatalf("the report names %d items, want %d", len(capability.Items), len(BoundaryItems))
	}
	for _, item := range capability.Items {
		if item.IsEnforced || item.Reason == "" {
			t.Fatalf("item %s is enforced or gives no reason: %+v", item.Item, item)
		}
	}
}

func TestRecordedEvidenceEnforcesOnlyAnItemWithANativeMechanism(t *testing.T) {
	folder := t.TempDir()
	shown := map[BoundaryItem]string{}
	for _, item := range BoundaryItems {
		shown[item] = "run-1"
	}
	writeEvidence(t, folder, map[string]map[BoundaryItem]string{"codex@0.165.0/" + runtime.GOOS: shown})

	capability, err := InspectProtection(LocalPlatform(), "codex", "0.165.0", NativeEvidence{Folder: folder})
	if err != nil {
		t.Fatal(err)
	}

	for _, item := range capability.Items {
		if item.Mechanism.Native == "" && item.IsEnforced {
			t.Fatalf("item %s is enforced without a native mechanism", item.Item)
		}
		if item.Mechanism.Native != "" && (!item.IsEnforced || item.Evidence != "run-1") {
			t.Fatalf("item %s has a mechanism and evidence but is not enforced: %+v", item.Item, item)
		}
	}
	if capability.Available {
		t.Fatal("Codex reported available though its sandbox leaves reads open")
	}
}

func TestEvidenceOfAnotherBuildDoesNotCount(t *testing.T) {
	folder := t.TempDir()
	writeEvidence(t, folder, map[string]map[BoundaryItem]string{
		"claude@2.1.322/" + runtime.GOOS: {InstallWrites: "run-old"},
	})

	capability, err := InspectProtection(LocalPlatform(), "claude", "2.1.323", NativeEvidence{Folder: folder})
	if err != nil {
		t.Fatal(err)
	}

	for _, item := range capability.Items {
		if item.IsEnforced {
			t.Fatalf("item %s counted evidence of another build", item.Item)
		}
	}
}

func TestEvidenceOthersCanReadIsRefused(t *testing.T) {
	folder := t.TempDir()
	writeEvidence(t, folder, map[string]map[BoundaryItem]string{})
	if err := os.Chmod(filepath.Join(folder, evidenceName), 0o644); err != nil {
		t.Fatal(err)
	}

	if _, err := InspectProtection(LocalPlatform(), "claude", "2.1.323", NativeEvidence{Folder: folder}); err == nil {
		t.Fatal("evidence readable by others was accepted")
	}
}

func TestAnUnknownProgramIsRefused(t *testing.T) {
	if _, err := InspectProtection(LocalPlatform(), "gemini", "1.0.0", NativeEvidence{Folder: t.TempDir()}); err != ErrUnknownDriver {
		t.Fatalf("got %v, want ErrUnknownDriver", err)
	}
}

func writeEvidence(t *testing.T, folder string, records map[string]map[BoundaryItem]string) {
	t.Helper()
	content, err := json.Marshal(records)
	if err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(folder, evidenceName), content, secretFileMode); err != nil {
		t.Fatal(err)
	}
}
