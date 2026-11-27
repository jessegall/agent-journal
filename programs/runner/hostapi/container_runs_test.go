package hostapi

import (
	"context"
	"errors"
	"testing"

	"journal-runner/dockermock"
	"journal-runner/host"
)

func TestAHostWithNoDaemonRefusesContainerRunsAndListsNone(t *testing.T) {
	table := OpenProcessTable(t.TempDir(), host.Containers{}, nil, nil)

	_, ran := carry(testInstructions{ProcessTable: table}, "run_containers")(context.Background(),
		Instruction{ID: "r", Type: "run_containers", Payload: `{"runs":[]}`})
	listed, err := carry(testInstructions{ProcessTable: table}, "list_containers")(context.Background(),
		Instruction{ID: "l", Type: "list_containers", Payload: `{"name":"journal.account","value":"a7"}`})

	var refusal RefusalError
	if !errors.As(ran, &refusal) || refusal.Refusal != Unsafe {
		t.Fatalf("a host with no daemon ran containers: %v", ran)
	}
	if names, isList := listed["names"].([]any); err != nil || !isList || len(names) != 0 {
		t.Fatalf("a host with no daemon listed %v, %v", listed, err)
	}
}

func TestAContainerOfALabelIsListedByItsName(t *testing.T) {
	daemon := dockermock.Start(t, mockImage)
	table, _ := mockTable(t, daemon)

	if _, err := carry(testInstructions{ProcessTable: table}, "open_container")(context.Background(), openInstruction(t, "p1", "never", mockImage)); err != nil {
		t.Fatal(err)
	}
	listed, err := table.ListContainers(context.Background(), Instruction{}, host.ContainerLabel{Name: "journal.session", Value: "p1"})

	if err != nil || len(listed.Names) != 1 || listed.Names[0] != "journal-process-p1" {
		t.Fatalf("the label listed %v, %v", listed, err)
	}
}
