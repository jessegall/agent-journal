package device

import "testing"

// A host enrolled again under its own id holds a new secret, so the folder holding the old one is not that
// enrollment: enrolling writes the new secret.
func TestAnEnrollmentWithAnotherSecretIsNotTheOneHeld(t *testing.T) {
	state := State{Folder: t.TempDir() + "/state"}
	held := Enrollment{JournalURL: "http://journal", HostID: "host-1", Secret: "first"}
	if err := state.Save(held); err != nil {
		t.Fatal(err)
	}

	if !state.HoldsEnrollment(held) || state.HoldsEnrollment(Enrollment{JournalURL: "http://journal", HostID: "host-1", Secret: "second"}) {
		t.Fatal("the held enrollment is told from one with another secret wrongly")
	}
}
