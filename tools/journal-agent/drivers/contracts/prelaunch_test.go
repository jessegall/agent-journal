package contracts

import "testing"

func TestAnOperationTheSnapshotDoesNotNameIsUnsupported(t *testing.T) {
	snapshot := SupportSnapshot{CapabilityRun: {State: SupportAllowed}}

	if snapshot.SupportOf(CapabilityRun).State != SupportAllowed {
		t.Fatal("a named operation lost its support")
	}
	if snapshot.SupportOf(CapabilityWatch).State != SupportUnsupported {
		t.Fatal("an operation the snapshot does not name is not unsupported")
	}
}

func TestAnUnsupportedOperationIsUnavailableAndMadeNoProcess(t *testing.T) {
	result := Unsupported(RequestIdentity{RequestID: "one"})

	if result.Progress != ProgressUnavailable || !result.NoProcessCreated || result.Request.RequestID != "one" {
		t.Fatalf("an unsupported operation answered %+v", result)
	}
}
