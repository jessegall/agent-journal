package terminal

import "testing"

func TestAPrivateValueIsWrittenOnceAndARepeatWritesNothing(t *testing.T) {
	gate, grant, _, program := receiptGate(t)
	submission := PrivateOperation{GrantID: grant.ID, Sequence: 1, SubmissionID: "private-1", Value: "hunter2"}

	first := gate.WritePrivate(submission)
	repeat := gate.WritePrivate(submission)
	other := submission
	other.Value = "different"
	again := gate.WritePrivate(other)

	if first.Outcome != Applied || repeat.Outcome != Applied || again.Outcome != Applied {
		t.Fatalf("the submission answered %s, %s and %s", first.Outcome, repeat.Outcome, again.Outcome)
	}
	if program.String() != "hunter2"+enterKey {
		t.Fatalf("the program got %q", program.String())
	}
	for id := range gate.privateOutcomes {
		if id != "private-1" {
			t.Fatalf("the gate kept %q", id)
		}
	}
}

func TestAPrivateValueThroughAnEndedGrantWritesNothing(t *testing.T) {
	gate, grant, _, program := receiptGate(t)
	_ = gate.Release(grant.ID)

	receipt := gate.WritePrivate(PrivateOperation{GrantID: grant.ID, Sequence: 1, SubmissionID: "private-1", Value: "x"})

	if receipt.Outcome != Expired || program.Len() != 0 {
		t.Fatalf("an ended grant answered %s and the program got %q", receipt.Outcome, program.String())
	}
}
